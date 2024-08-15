SELECT u.username AS username, w.title AS workspace_title, t.name AS api_token_name, su.duration_in_ms AS usage_duration_in_ms, su.usage_started_at, s.name AS service_name, s.cost_per_ms AS service_cost_per_ms FROM `service_usages` AS su LEFT JOIN services AS s ON su.service_id = s.id LEFT JOIN api_tokens AS t ON su.api_token_id = t.id LEFT JOIN workspaces AS w ON t.workspace_id = w.id LEFT JOIN users AS u ON w.user_id = u.id;