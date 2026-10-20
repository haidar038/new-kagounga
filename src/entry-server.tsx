import { renderToString } from "react-dom/server";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { routes } from "./app/routes";
import { preloadPage } from "./app/pages";
import { initI18n } from "./i18n";
import { getLocaleFromPath } from "./lib/seo";

/**
 * Render a route to static HTML for the SEO build.
 * The route chunk is preloaded so Suspense renders inline instead of emitting
 * a hidden streaming segment (which would hide body content from raw HTML).
 */
export async function render(pathname: string): Promise<string> {
  await Promise.all([
    initI18n(getLocaleFromPath(pathname)),
    preloadPage(pathname),
  ]);
  const router = createMemoryRouter(routes, { initialEntries: [pathname] });
  return renderToString(<RouterProvider router={router} />);
}
