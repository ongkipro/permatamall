DROP INDEX IF EXISTS idx_landing_pages_slug;
DROP INDEX IF EXISTS idx_orders_created_at;
DROP INDEX IF EXISTS idx_orders_order_number;
DROP INDEX IF EXISTS idx_orders_public_status_token;

DROP INDEX IF EXISTS idx_landing_sections_page;
CREATE INDEX IF NOT EXISTS idx_landing_sections_page
  ON landing_sections(landing_page_id, sort_order, created_at);
