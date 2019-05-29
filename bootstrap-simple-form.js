(() => {

  /**
   * Helper function. Returns empty string if provided argument falsy, otherwise return boolean true.
   */
  const _has = (element) => !element ? '' : true;

  /**
   * Helper function. Returns empty string if provided argument is not array, otherwise return boolean true.
   */
  const _isArray = (element) => Array.isArray(element) || '';

  /**
   * Helper function. If control type within required, will return true, otherwise empty string.
   * Both parameters type of EControlType enum.
   */
  const _is = (controlType, requiredControlTypes) => (Array.isArray(requiredControlTypes) ? requiredControlTypes : [requiredControlTypes]).includes(controlType) || '';

  /**
   * Styles for color input;
   */
  const colorInputStyle = 'width: 50px; padding: 0 4px;';

  /**
   * Set of input patterns.
   * Visit http://html5pattern.com for commonly used patterns.
   *
   * {DATE} DD.MM.YYYY
   * {TIME} HH:MM:SS
   */
  const EInputPattern = Object.freeze({
    DATE: '(0[1-9]|1[0-9]|2[0-9]|3[01]).(0[1-9]|1[012]).[0-9]{4}',
    TIME: '(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}'
  });

  /**
   * Set of possible control types. (enum simulation)
   */
  const EControlType = Object.freeze({
    input: 'input',
    date: 'date',
    email: 'email',
    checkbox: 'checkbox',
    select: 'select',
    textarea: 'textarea',
    radio: 'radio',
    colorPicker: 'colorPicker'
  });

  /**
   * Default options set.
   *
   * @prop {string} formAction Specify url and method for form data to be sent.
   * @prop {string} submitButtonText Submit button text.
   * @prop {boolean} checkBootstrapStylesLoaded Try check if bootstrap css loaded.
   * @prop {object} bootstrapStylesOptions Get fresh params from official bootstrap cdn (https://www.bootstrapcdn.com/).
   * @prop {Node} formContainerNode Specify target node where form will be drawn. By default div node will be appended to the body.
   * @prop {string} formHeader Set to null to remove header or set any string header.
   * @prop {array} formControls A set of form controls. Control type defined with EControlType enum. See example for other properties.
   */
  const defaultScheme = {
    formAction: {
      address: '/rest',
      method: 'post'
    },
    submitButtonText: 'Submit',
    checkBootstrapStylesLoaded: true,
    bootstrapStylesOptions: {
      href: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css',
      integrity: 'sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T',
      crossorigin: 'anonymous'
    },
    formContainerNode: document.getElementsByTagName('body')[0].appendChild(document.createElement('div')),
    formHeader: 'Please fill the form',
    formControls: []
  };

  /**
   * Header html getter.
   * @param {string} header Provide header or null.
   */
  const getFormHeaderHtml = (header) => _has(header) && `
    <div class="card-header text-center">
        <h3>${header}</h3>
    </div>
  `;

  const getLabelHtml = (label, controlType, id) => _has(label) && `
      <label ${_is(controlType, [EControlType.checkbox, EControlType.radio]) && 'class="form-check-label"'} ${_has(id) && `for="${id}"`}>
        ${label}
      </label>
  `;

  const getCommonControlInnerHtml = (
    {
      name,
      insideControlHtml,
      type,
      controlClassName,
      preLabel,
      postLabel,
      closingTag,
      valueAttribute,
      checked,
      openingTag,
      inputStyle,
      title,
      id,
      placeholder,
      help,
      rows,
      disabled,
      required,
      pattern,
    }
  ) => {

    return `
      ${preLabel} 
      <${openingTag}
        class="${controlClassName}"
        name="${name || id}"
        ${_has(inputStyle) && `style="${inputStyle}"`}
        ${_has(type) && `type="${type}"`}
        ${_has(title) && `title="${title}"`}
        ${_has(disabled) && `disabled`}
        ${_has(rows) && `rows="${rows}"`}
        ${_has(id) && `id="${id}"`}
        ${_has(placeholder) && `placeholder="${placeholder}"`}
        ${_has(checked) && 'checked'}
        ${_has(required) && 'required'}
        ${_has(pattern) && `pattern="${pattern}"`}
        ${valueAttribute !== undefined ? `value="${valueAttribute}"` : ''}
      >${insideControlHtml}${closingTag}
      ${postLabel}
      ${_has(help) && `<small class="form-text text-muted">${help}</small>`}    
    `
  };

  /**
   * Returns string with html generated for common control.
   */
  const getControlHtml = (
    {
      controlType,
      title,
      columns,
      offset,
      label,
      name,
      id,
      placeholder,
      help,
      rows,
      options,
      disabled,
      fullWidth,
      value,
      required,
      pattern,
    }
  ) => {
    const columnsNumber = columns || 12;
    const offsetNumber = offset || 0;
    const labelHtml = getLabelHtml(label, controlType, id);
    let controlsInnerHtml = '';
    let type = '';
    let controlClassName = 'form-control';
    let preLabel = labelHtml;
    let postLabel = '';
    let closingTag = '';
    let insideControlHtml = '';
    let valueAttribute = '';
    let checked = '';
    let openingTag = controlType;
    let inputStyle = '';

    switch (controlType) {
      case EControlType.textarea:
        closingTag = `</${EControlType.textarea}>`;
        insideControlHtml = value || '';
        break;
      case EControlType.select:
        closingTag = `</${EControlType.select}>`;
        insideControlHtml = _isArray(options) && options.map(option => `<option>${option}</option>`).join('');
        break;
      case EControlType.input:
        valueAttribute = value || '';
        break;
      case EControlType.date:
        openingTag = EControlType.input;
        valueAttribute = value || '';
        pattern = EInputPattern.DATE;
        title = title || 'Enter date as DD.MM.YYYY';
        break;
      case EControlType.email:
        openingTag = EControlType.input;
        valueAttribute = value || '';
        type = 'email';
        break;
      case EControlType.checkbox:
        openingTag = EControlType.input;
        type = 'checkbox';
        controlClassName = 'form-check-input';
        preLabel = '';
        postLabel = labelHtml;
        valueAttribute = value || 'false';
        checked = value;
        break;
      case EControlType.radio:
        openingTag = EControlType.input;
        type = 'radio';
        controlClassName = 'form-check-input';
        preLabel = '';
        break;
      case EControlType.colorPicker:
        openingTag = EControlType.input;
        type = 'color';
        valueAttribute = value || '';
        inputStyle = colorInputStyle;
        break;
    }

    const finalControlOptions = {
      name,
      insideControlHtml,
      type,
      controlClassName,
      preLabel,
      postLabel,
      closingTag,
      valueAttribute,
      checked,
      openingTag,
      inputStyle,
      title,
      id,
      placeholder,
      help,
      rows,
      disabled,
      required,
      pattern,
    };

    switch (controlType) {
      case EControlType.radio:
        const helpHtml = `${_has(help) && `<small class="form-text text-muted">${help}</small>`}`;
        const buttons = _isArray(options) && options.map((option, index) => {
          const buttonId = `${id}_${index}`;
          const radioControlInnerHtml = getCommonControlInnerHtml({
            ...finalControlOptions,
            id: buttonId,
            postLabel: getLabelHtml(option.label, controlType, buttonId),
            valueAttribute: option.value,
            checked: option.checked,
            help: '',
            name: name || id,
            disabled: disabled || option.disabled
          });

          return `<div class="form-check">${radioControlInnerHtml}</div>`;
        }).join('');

        controlsInnerHtml = labelHtml + buttons + helpHtml;
        break;
      case EControlType.checkbox:
        controlsInnerHtml = `<div class="form-check">${getCommonControlInnerHtml(finalControlOptions)}</div>`;
        break;
      default:
        controlsInnerHtml = getCommonControlInnerHtml(finalControlOptions);
    }

    return `
      <div class="form-group col-${columnsNumber} offset-${offsetNumber}">
        ${controlsInnerHtml}
      </div>
      ${_has(fullWidth) && `<div class="col-${12 - columnsNumber}"></div>`}
    `;
  };

  /**
   * Initial form inner html.
   */
  const getFormInnerHtml = ({formAction, formHeader, formControls, submitButtonText}) => {

    const formControlsHtml = formControls
      .map((control, index) => getControlHtml({...control, id: `${control.controlType}-${index}`}))
      .join('');

    return `
      <div class="container bootstrap-simple-form" style="padding-top: 36px">
        <form action="${formAction.address}" method="${formAction.method}">
          <div class="card">
            ${getFormHeaderHtml(formHeader)}
            <div class="card-body">
              <div class="form-row">
                ${formControlsHtml}
              </div>
            </div>
            <div class="card-footer text-center">
                <button onclick="BootstrapSimpleForm.handleSubmit(event, this)" type="submit" class="btn btn-primary">${submitButtonText}</button>
            </div>
          </div>
          <div class="invisible-inputs-container"></div>
        </form>
      </div>
    `
  };

  /**
   * Form constructor class.
   */
  class BootstrapSimpleForm {
    constructor(scheme = defaultScheme) {
      this.scheme = {...defaultScheme, ...scheme};
      const {checkBootstrapStylesLoaded, formContainerNode} = this.scheme;

      if (!(formContainerNode instanceof Node)) {
        return;
      } else {
        formContainerNode.innerHTML = getFormInnerHtml(this.scheme);
      }

      this.checkboxesClickListener();

      checkBootstrapStylesLoaded && this.checkBootstrapStylesLoaded();

    }

    checkboxesClickListener = () => {
      document.querySelectorAll('.bootstrap-simple-form input[type="checkbox"]').forEach(
        checkbox => {
          checkbox.addEventListener('click', (e) => {
            e.target.value = e.target.checked;
          })
        }
      )
    };

    checkBootstrapStylesLoaded = () => {
      const {styleSheets} = document;
      let loaded = false;

      for (let styleSheetKey in styleSheets) {
        if (styleSheets.hasOwnProperty(styleSheetKey)) {
          loaded = (styleSheets[styleSheetKey].href.indexOf('bootstrap.css') > -1) ||
            (styleSheets[styleSheetKey].href.indexOf('bootstrap.min.css') > -1);
          if (loaded) break;
        }
      }

      if (!loaded) {
        const {href, integrity, crossorigin} = this.scheme.bootstrapStylesOptions;
        const link = document.createElement('link');

        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', href);
        link.setAttribute('integrity', integrity);
        link.setAttribute('crossorigin', crossorigin);

        document.getElementsByTagName('head')[0].appendChild(link);
      }
    }


  }

  const handleSubmit = (event, submitButton) => {

    const form = submitButton.closest('.bootstrap-simple-form form');

    if (form && form.checkValidity()) {
      const inputsContainer = form.querySelector('.invisible-inputs-container');

      // removes all children
      while (inputsContainer.firstChild) {
        inputsContainer.removeChild(inputsContainer.firstChild);
      }

      // making invisible copies of all disabled or not checked checkboxes
      // so they can be submitted too
      [
        ...form.querySelectorAll('.bootstrap-simple-form input[type="checkbox"]:not(:checked)'),
        ...form.querySelectorAll('.bootstrap-simple-form [disabled]:not([type="radio"])'),
        ...form.querySelectorAll('.bootstrap-simple-form [checked][disabled][type="radio"]')
      ].forEach(
        checkbox => {
          const checkboxClone = checkbox.cloneNode();

          checkboxClone.setAttribute('type', 'hidden');
          checkboxClone.removeAttribute('disabled');
          inputsContainer.appendChild(checkboxClone);
        });

      // radio buttons is a special case. If non radio checked, an empty string will be sent.
      const radioNameToValueMap = [...form.querySelectorAll('.bootstrap-simple-form [type="radio"]')].reduce(
        (map, button) => {
          map[button.name] = button.checked ? button.value : map[button.name];
          return map;
        }, {});
      for (let name in radioNameToValueMap) {
        if (!radioNameToValueMap.hasOwnProperty(name) || radioNameToValueMap[name] !== undefined) {
          continue;
        }
        const radioInput = document.createElement('input');

        radioInput.type = 'hidden';
        radioInput.name = name;
        radioInput.value = '';
        inputsContainer.appendChild(radioInput);
      }

    } else {
      console.error(!form ? 'can\'t find form to submit' : 'make sure form is valid before submit');
    }
  };

  BootstrapSimpleForm.EControlType = EControlType;
  BootstrapSimpleForm.handleSubmit = handleSubmit;

  window.BootstrapSimpleForm = BootstrapSimpleForm;
})();