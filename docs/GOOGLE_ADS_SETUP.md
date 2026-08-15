# Google Ads Conversion Signal Engine & Merchant Center Setup Guide

> **Official Operating System Documentation for Permata Mall**  
> Engine Stack: **Astro SSR + Cloudflare Workers + Google Tag (gtag.js) + GTM + Enhanced Conversions + Consent Mode v2 + Merchant Center XML Feed**  
> Target Domain: `https://permatamall.shop`

---

## 1. System Architecture Overview

Permata Mall implements a 4-layer Google Ads Conversion Signal architecture designed for maximum attribution accuracy, Target CPA / Target ROAS Smart Bidding efficiency, and zero duplicate conversion counting:

$$\text{Ad Click (gclid, gbraid, wbraid)} \longrightarrow \text{Consent Mode v2 + Conversion Linker} \longrightarrow \text{Enhanced Conversions} \longrightarrow \text{Google Ads API / Merchant Center Feed}$$

```text
┌───────────────────────────────────────────────────────────────────────────────────┐
│                           GOOGLE ADS SIGNAL ARCHITECTURE                           │
└───────────────────────────────────────────────────────────────────────────────────┘
 ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────────┐
 │  Landing Page Click  │───>│  Click-ID Storage    │───>│  Consent Mode v2 Matrix  │
 │ (gclid/gbraid/wbraid)│    │ (zanoby_click_ids)   │    │ (ID/MY: Granted | EEA: Denied)│
 └──────────────────────┘    └──────────────────────┘    └──────────────────────────┘
                                                                       │
                                                                       ▼
 ┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────────┐
 │  Merchant Center Feed│    │ Enhanced Conversions │    │  Conversion Deduplication│
 │ (/feed/google-catalog│    │ (SHA-256 Phone/Name) │    │  (transaction_id: ORD-N) │
 └──────────────────────┘    └──────────────────────┘    └──────────────────────────┘
```

---

## 2. Step-by-Step Setup Guide

### Step 1: Create Purchase Conversion Action in Google Ads

1. Open **Google Ads Manager** (`https://ads.google.com`).
2. Go to **Goals** $\rightarrow$ **Conversions** $\rightarrow$ **Summary**.
3. Click **+ New conversion action** $\rightarrow$ Select **Website**.
4. Enter website domain: `https://permatamall.shop` and click **Scan**.
5. Scroll down to **Add a conversion action manually** and configure:
   - **Goal category**: `Purchase` (Pembelian).
   - **Conversion name**: `Zanoby Purchase - Website`.
   - **Value**: Select *Use different values for each conversion*. Default value: `149000`, Default currency: `IDR`.
   - **Count**: Select *Every* (Setiap konversi dihitung, cocok untuk transaksi e-commerce).
   - **Click-through conversion window**: `30 days`.
   - **Attribution model**: `Data-driven` (Rekomendasi resmi Google).
6. Click **Done** $\rightarrow$ **Save and Continue**.
7. Note down your **Conversion ID** (e.g. `AW-123456789`) and **Conversion Label** (e.g. `AbCd_EFGHIJKlm`).

---

### Step 2: Enable Enhanced Conversions for Web

1. On the Conversion Action details page, expand the **Enhanced conversions** section.
2. Check **Turn on enhanced conversions**.
3. Select **Google Tag** or **Google Tag Manager** as your implementation method.
4. Permata Mall automatically hashes customer first-party data client-side before dispatch:
   - `phone_number`: Normalized to E.164 format (e.g., `+6281234567890`) and SHA-256 hashed.
   - `first_name` & `last_name`: Trimmed and SHA-256 hashed.
   - `email`: Normalized and SHA-256 hashed if provided.
5. Click **Save**.

---

### Step 3: Configure GTM Container (Optional / Recommended)

If using Google Tag Manager (`GTM-XXXXXXX`):

#### 1. Add Tags in GTM Workspace
- **Tag 1: Conversion Linker**
  - Tag Type: `Conversion Linker`
  - Trigger: `All Pages`
- **Tag 2: Google Tag**
  - Tag Type: `Google Tag`
  - Tag ID: `AW-123456789`
  - Trigger: `All Pages`
- **Tag 3: Google Ads Conversion Tracking**
  - Tag Type: `Google Ads Conversion Tracking`
  - Conversion ID: `AW-123456789` (atau variable `{{Google Ads ID}}`)
  - Conversion Label: `AbCd_EFGHIJKlm` (atau variable `{{Google Ads Label}}`)
  - Value: `{{dlv - total_price}}`
  - Currency Code: `IDR`
  - Transaction ID: `{{dlv - order_id}}`
  - Enable Enhanced Conversions: Checked $\rightarrow$ User Data Variable: `{{dlv - user_data}}`
  - Trigger: Custom Event `purchase`

---

### Step 4: Submit Merchant Center Catalog XML Feed (PMax & Shopping Ads)

1. Open **Google Merchant Center** (`https://merchants.google.com`).
2. Go to **Products** $\rightarrow$ **Feeds** $\rightarrow$ Click **+ Primary Feed**.
3. Target Country: **Indonesia**, Language: **Indonesian**.
4. Select **Scheduled Fetch** (Pengambilan Terjadwal).
5. Name: `Permata Mall Catalog Feed`.
6. Feed URL: `https://permatamall.shop/feed/google-catalog.xml`
7. Fetch frequency: **Daily** (Setiap Hari).
8. Automatic Taxonomy Engine:
   - Permata Mall automatically maps internal product categories to Google Product Category (GPC) IDs:
     - Pertanian / Pupuk: `2863` (`Business & Industrial > Agriculture`)
     - Kecantikan / Skincare: `2547` (`Health & Beauty > Personal Care > Skincare`)
     - Herbal / Stamina: `642` (`Health & Beauty > Health Care > Fitness & Nutrition`)
     - Perkakasan / Asahan: `645` (`Home & Garden > Kitchen & Dining > Kitchen Knives`)

---

### Step 5: Verify & Audit Live Signals

1. Install the **Google Tag Assistant Companion** browser extension.
2. Open `https://permatamall.shop` in Tag Assistant debug mode.
3. Perform a test purchase on a product page or checkout form.
4. Verify the `conversion` event payload:
   ```json
   {
     "send_to": "AW-123456789/AbCd_EFGHIJKlm",
     "value": 249000,
     "currency": "IDR",
     "transaction_id": "ORD-2026-88192",
     "user_data": {
       "sha256_phone_number": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
       "sha256_first_name": "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"
     }
   }
   ```

---

## 3. Core Contract & Consent Rules

| Parameter | Value / Behavior |
| --- | --- |
| **Consent Default (ID/MY)** | `ad_storage: granted`, `ad_user_data: granted`, `ad_personalization: granted` |
| **Consent Default (EEA/UK)** | `ad_storage: denied`, `ad_user_data: denied`, `ad_personalization: denied` |
| **Deduplication Key** | Backend order number (`transaction_id`). Prevents reloaded thank-you page count spikes. |
| **Click-ID Storage** | Captured on landing page (`gclid`, `gbraid`, `wbraid`) stored in `zanoby_click_ids` cookie for 90 days. |
