/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea: () => width * height,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  return new proto.constructor(...Object.values(JSON.parse(json)));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  CSSSelector: function CSSSelector() {
    this.element = (value) => {
      if (this.refElement) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      if (this.refId || this.refClass || this.refAttr
        || this.refPseudoClass || this.refPseudoElement) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.refElement = value;
      return this;
    };

    this.id = (value) => {
      if (this.refId) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      if (this.refClass || this.refAttr || this.refPseudoClass || this.refPseudoElement) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      this.refId = value;
      return this;
    };

    this.class = (value) => {
      if (this.refAttr || this.refPseudoClass || this.refPseudoElement) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      if (this.refClass) {
        this.refClass = [...this.refClass, value];
      } else {
        this.refClass = [value];
      }
      return this;
    };

    this.attr = (value) => {
      if (this.refPseudoClass || this.refPseudoElement) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      if (this.refAttr) {
        this.refAttr = [...this.refAttr, value];
      } else {
        this.refAttr = [value];
      }
      return this;
    };

    this.pseudoClass = (value) => {
      if (this.refPseudoElement) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
      if (this.refPseudoClass) {
        this.refPseudoClass = [...this.refPseudoClass, value];
      } else {
        this.refPseudoClass = [value];
      }
      return this;
    };

    this.pseudoElement = (value) => {
      if (this.refPseudoElement) {
        throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
      }
      this.refPseudoElement = value;
      return this;
    };

    this.stringify = () => {
      let result = '';
      if (this.refElement) {
        result += this.refElement;
      }
      if (this.refId) {
        result += '#'.concat(this.refId);
      }
      if (this.refClass) {
        result += this.refClass.map((element) => '.'.concat(element)).join('');
      }
      if (this.refAttr) {
        result += this.refAttr.map((element) => '['.concat(element, ']')).join('');
      }
      if (this.refPseudoClass) {
        result += this.refPseudoClass.map((element) => ':'.concat(element)).join('');
      }
      if (this.refPseudoElement) {
        result += '::'.concat(this.refPseudoElement);
      }
      return result;
    };
  },

  CombinedCSSSelector: function CombinedCSSSelector(selector1, combinator, selector2) {
    this.refSelector1 = selector1;
    this.refCombinator = combinator;
    this.refSelector2 = selector2;

    this.stringify = () => `${this.refSelector1.stringify()} ${this.refCombinator} ${this.refSelector2.stringify()}`;
  },
  element(value) {
    return new this.CSSSelector().element(value);
  },

  id(value) {
    return new this.CSSSelector().id(value);
  },

  class(value) {
    return new this.CSSSelector().class(value);
  },

  attr(value) {
    return new this.CSSSelector().attr(value);
  },

  pseudoClass(value) {
    return new this.CSSSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new this.CSSSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new this.CombinedCSSSelector(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
