"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Chat from "../Chat";
import { createPortal } from "react-dom";

export default function SurgeonPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Create a container for the portal
    const container = document.createElement("div");
    container.id = "website-portal";
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      // Cleanup
      container.remove();
    };
  }, []);

  useEffect(() => {
    const fetchUrl = async () => {
      if (!q) return;

      setLoading(true);
      setResourcesLoaded(false);

      try {
        const response = await fetch(
          `/api/fetch-url?url=${encodeURIComponent(q)}`
        );
        if (!response.ok) throw new Error("Failed to fetch URL");
        const data = await response.json();

        // Create a temporary div to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(data.html, "text/html");

        // Get all stylesheets
        const styles = Array.from(doc.getElementsByTagName("link"))
          .filter((link) => link.rel === "stylesheet")
          .map((link) => link.href);

        // Get all inline styles
        const inlineStyles = Array.from(doc.getElementsByTagName("style")).map(
          (style) => style.textContent
        );

        // Get all script tags
        const scripts = Array.from(doc.getElementsByTagName("script"))
          .map((script) => script.src)
          .filter((src) => src);

        // Get all images
        const images = Array.from(doc.getElementsByTagName("img")).map(
          (img) => img.src
        );

        // Function to load a resource
        const loadResource = (url: string): Promise<void> => {
          return new Promise((resolve) => {
            if (url.startsWith("data:")) {
              resolve();
              return;
            }
            const resource = new Image();
            resource.onload = () => resolve();
            resource.onerror = () => resolve(); // Resolve even on error to not block loading
            resource.src = url;
          });
        };

        // Create a style element for the website content
        const websiteStyles = document.createElement("style");
        websiteStyles.id = "website-styles";
        portalContainer?.appendChild(websiteStyles);

        // Load all stylesheets and scope them
        await Promise.all(
          styles.map((href) => {
            return new Promise((resolve) => {
              fetch(href)
                .then((response) => response.text())
                .then((css) => {
                  // Scope the CSS to the website container
                  const scopedCss = css.replace(/([^{}]*){/g, (match, selector) => {
                    // Skip @keyframes, @media, etc.
                    if (selector.trim().startsWith("@")) return match;
                    return `#website-content ${selector}{`;
                  });
                  websiteStyles.textContent += scopedCss;
                  resolve();
                })
                .catch(resolve);
            });
          })
        );

        // Scope inline styles
        inlineStyles.forEach((style) => {
          if (style) {
            const scopedCss = style.replace(/([^{}]*){/g, (match, selector) => {
              if (selector.trim().startsWith("@")) return match;
              return `#website-content ${selector}{`;
            });
            websiteStyles.textContent += scopedCss;
          }
        });

        // Load all scripts
        await Promise.all(
          scripts.map((src) => {
            return new Promise((resolve) => {
              const script = document.createElement("script");
              script.src = src;
              script.onload = resolve;
              script.onerror = resolve; // Resolve even on error
              portalContainer?.appendChild(script);
            });
          })
        );

        // Load all images
        await Promise.all(images.map(loadResource));

        // Set the HTML content
        setHtmlContent(data.html);

        // Wait a bit more to ensure styles are applied
        setTimeout(() => {
          setResourcesLoaded(true);
        }, 500);
      } catch (err) {
        console.error("Error fetching URL:", err);
        setResourcesLoaded(true); // Still set to true to show content even if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchUrl();

    // Cleanup function
    return () => {
      // Cleanup
      if (portalContainer) {
        portalContainer.innerHTML = "";
      }
    };
  }, [q, portalContainer]);

  if (loading || !resourcesLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {portalContainer && createPortal(
        <div
          id="website-content"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
          className="w-full h-full"
        />,
        portalContainer
      )}
      <Chat />
    </>
  );
}
