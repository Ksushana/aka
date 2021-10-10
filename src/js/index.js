// Shared
// import './shared/svgSprite';

// Utils
import DOMReady from './utils/DOMReady';

// Pages
import initAll from './pages/all';

DOMReady(() => {
  initAll();
});
