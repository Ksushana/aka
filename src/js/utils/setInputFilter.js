/* eslint-disable no-param-reassign */
export function setInputFilter(textbox, inputFilter) {
  ['input', 'keydown', 'keyup', 'mousedown', 'mouseup', 'select', 'contextmenu', 'drop'].forEach(
    event => {
      textbox.addEventListener(event, () => {
        if (inputFilter(textbox.value)) {
          textbox.oldValue = textbox.value;
          textbox.oldSelectionStart = textbox.selectionStart;
          textbox.oldSelectionEnd = textbox.selectionEnd;
        } else if (Object.prototype.hasOwnProperty.call(textbox, 'oldValue')) {
          textbox.value = textbox.oldValue;
          textbox.setSelectionRange(textbox.oldSelectionStart, textbox.oldSelectionEnd);
        }
      });
    }
  );
}

export default setInputFilter;
