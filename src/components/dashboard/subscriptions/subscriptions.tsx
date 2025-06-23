"use client"

import { SubscriptionDetail } from "@/components/dashboard/subscriptions/components/subscription-detail"
import { NoSubscriptionView } from "@/components/dashboard/subscriptions/views/no-subscription-view"
import { MultipleSubscriptionsView } from "@/components/dashboard/subscriptions/views/multiple-subscriptions-view"
import { SubscriptionErrorView } from "@/components/dashboard/subscriptions/views/subscription-error-view"
import { getSubscriptions } from "@/utils/paddle/get-subscriptions"
import { useEffect, useState } from "react"
import { LoadingScreen } from "@/components/dashboard/layout/loading-screen"
import type { SubscriptionResponse } from "@/lib/api.types"

export function Subscriptions() {
  const [subscriptionResponse, setSubscriptionResponse] = useState<SubscriptionResponse>({
    data: [],
    hasMore: false,
    totalRecords: 0,
    error: undefined,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      try {
        const response = await getSubscriptions()
        setSubscriptionResponse(response)
      } catch (e) {
        console.error("Failed to fetch subscriptions:", e)
        setSubscriptionResponse({ data: [], hasMore: false, totalRecords: 0, error: "Failed to load subscriptions." })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return <LoadingScreen />
  } else if (subscriptionResponse.data && !subscriptionResponse.error) {
    if (subscriptionResponse.data.length === 0) {
      return <NoSubscriptionView />
    } else if (subscriptionResponse.data.length === 1) {
      return <SubscriptionDetail subscriptionId={subscriptionResponse.data[0].id} />
    } else {
      return <MultipleSubscriptionsView subscriptions={subscriptionResponse.data} />
    }
  } else {
    return <SubscriptionErrorView />
  }
}
