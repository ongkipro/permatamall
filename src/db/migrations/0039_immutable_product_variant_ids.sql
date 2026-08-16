CREATE TRIGGER product_variants_id_immutable
BEFORE UPDATE OF id ON product_variants
FOR EACH ROW
WHEN NEW.id <> OLD.id
BEGIN
  SELECT RAISE(ABORT, 'product_variants.id is an immutable external catalog identifier');
END;
