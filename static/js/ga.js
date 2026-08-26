// Google tag, loaded only after the visitor has granted at least one purpose.
// consent.html publishes the choice on window.jvdConsent before loading this.
var GA_MEASUREMENT_ID = "G-JMJZWSMNS3";

(function () {
  var consent = window.jvdConsent || {};

  var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
  if (dnt == "1" || dnt == "yes") return;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  // Queued before the tag loads, so the tag applies these the moment it starts.
  // Everything starts denied and is then raised only for what was granted:
  // analytics and advertising are separate purposes and separate signals.
  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied"
  });

  gtag("consent", "update", {
    analytics_storage: consent.analytics ? "granted" : "denied",
    ad_storage: consent.advertising ? "granted" : "denied",
    ad_user_data: consent.advertising ? "granted" : "denied",
    ad_personalization: consent.advertising ? "granted" : "denied"
  });

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_MEASUREMENT_ID;
  document.head.appendChild(script);

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);

  // The site has no forms or checkout, so intent shows up as leaving for a
  // channel where a conversation can start. These two are marked as key events
  // in GA and become the conversions Google Ads optimises towards.
  document.addEventListener("click", function (event) {
    var link = event.target.closest && event.target.closest("a[href]");
    if (!link) return;
    var href = link.getAttribute("href") || "";

    // The share row also emits mailto: links, but those carry no address —
    // they open an empty message about the page. Only a real address counts.
    if (/^mailto:[^?]/.test(href)) {
      gtag("event", "contact_email");
    } else if (href.indexOf("instagram.com") !== -1) {
      gtag("event", "contact_instagram");
    }
  });
})();
