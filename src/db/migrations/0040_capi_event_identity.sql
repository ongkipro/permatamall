DROP INDEX IF EXISTS `capi_event_outbox_event_id_unique`;
CREATE UNIQUE INDEX `capi_event_outbox_event_unique`
ON `capi_event_outbox` (`event_name`, `event_id`);
