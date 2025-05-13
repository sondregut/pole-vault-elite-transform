
CREATE OR REPLACE FUNCTION public.get_newsletter_sync_stats()
RETURNS TABLE (
  total bigint,
  synced bigint,
  unsynced bigint,
  sync_percentage numeric
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH counts AS (
    SELECT
      COUNT(*) AS total_count,
      COUNT(*) FILTER (WHERE synced_to_beehiiv = true) AS synced_count,
      COUNT(*) FILTER (WHERE synced_to_beehiiv IS NOT TRUE) AS unsynced_count
    FROM
      newsletter_subscribers
  )
  SELECT
    total_count AS total,
    synced_count AS synced,
    unsynced_count AS unsynced,
    CASE
      WHEN total_count = 0 THEN 0
      ELSE ROUND((synced_count::numeric / total_count::numeric) * 100, 1)
    END AS sync_percentage
  FROM
    counts;
END;
$$;
