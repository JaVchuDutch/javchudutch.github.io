// load GA-4 script
var dnt = navigator.doNotTrack || window.doNotTrack || navigator.msDoNotTrack;
var doNotTrack = dnt == "1" || dnt == "yes";
if (!doNotTrack) {
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
  document.head.appendChild(script);
  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "G-JMJZWSMNS3");
  };
}
