import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useChartData(metric: string, chain = 1, from = "", to = "") {
  const qs = new URLSearchParams({
    chain: String(chain),
    from,
    to,
  }).toString()

  const { data, error, mutate } = useSWR(`/api/chart/${metric}?${qs}`, fetcher, {
    refreshInterval: 30000, // Refresh every 30 seconds for real-time feel
    revalidateOnFocus: true,
  })

  return {
    data,
    error,
    isLoading: !error && !data,
    refresh: mutate,
  }
}

export function useMultipleMetrics(metrics: string[], chain = 1, from = "", to = "") {
  const results = metrics.map((metric) => {
    const qs = new URLSearchParams({
      chain: String(chain),
      from,
      to,
    }).toString()

    const { data, error, mutate } = useSWR(`/api/chart/${metric}?${qs}`, fetcher, {
      refreshInterval: 30000, // Refresh every 30 seconds for real-time feel
      revalidateOnFocus: true,
    })

    return {
      data,
      error,
      isLoading: !error && !data,
      refresh: mutate,
    }
  })

  return {
    data: results.reduce(
      (acc, result, index) => {
        acc[metrics[index]] = result.data
        return acc
      },
      {} as Record<string, any>,
    ),
    isLoading: results.some((result) => result.isLoading),
    error: results.find((result) => result.error)?.error,
    refresh: () => results.forEach((result) => result.refresh()),
  }
}
