import usePageProps from '../hooks/use_page_props'

/**
 * This function is used to check if a feature is enabled for a given page.
 * @param featureKey
 * @returns
 */
export default function isFeatureEnabled(featureKey: string): boolean {
  const pageProps = usePageProps<{ features: Record<string, boolean> }>()
  return !!pageProps.features[featureKey]
}
