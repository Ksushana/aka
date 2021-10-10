export default function closestParent(el, selector) {
  let element = el;
  const matchesSelector =
    element.matches ||
    element.webkitMatchesSelector ||
    element.mozMatchesSelector ||
    element.msMatchesSelector;

  while (element) {
    if (!matchesSelector.call(element, selector)) {
      element = element.parentElement;
    } else {
      return element;
    }
  }

  return null;
}
