/**
 * Expose `PriorityQueue`.
 */
module.exports = PriorityQueue;

/**
 * Initializes a new empty `PriorityQueue` with the given `comparator(a, b)`
 * function, uses `.DEFAULT_COMPARATOR()` when no function is provided.
 *
 * The comparator function must return a positive number when `a > b`, 0 when
 * `a == b` and a negative number when `a < b`.
 *
 * @param {Array} array=[]
 * @param {Function: Object x Object -> Number} comparator=this.DEFAULT_COMPARATOR
 * @return {PriorityQueue}
 * @api public
 * @complexity O(n) where `n` === array.length
 */
function PriorityQueue(array, comparator) {
  this._elements = []
  this._temp = []

  if (array instanceof Array) {
    this.length = array.length;
    if (array.length > 0) {
      var i;
      for (i = 0; i < this.length; i++) {
        this._elements.push(array[i]);
      }
      this._comparator = comparator || PriorityQueue.DEFAULT_COMPARATOR;

      for (i = Math.floor(this.length / 2) - 1; i >= 0; i--) {
        _sink(this._elements, i, this.length, this._comparator);
      }
    }
  } else {
    this._comparator = array || PriorityQueue.DEFAULT_COMPARATOR;
    this.length = 0;
  }
  this._begin_sorted = this.length;
}

/**
 * Compares `a` and `b`, when `a > b` it returns a positive number, when
 * it returns 0 and when `a < b` it returns a negative number.
 *
 * @param {String|Number} a
 * @param {String|Number} b
 * @return {Number}
 * @api public
 */
PriorityQueue.DEFAULT_COMPARATOR = function(a, b) {
  if (a instanceof Number && b instanceof Number) {
    return a - b;
  } else {
    a = a.toString();
    b = b.toString();

    if (a == b) return 0;

    return (a > b) ? 1 : -1;
  }
};

/**
 * Returns whether the priority queue is empty or not.
 *
 * @return {Boolean}
 * @api public
 * @complexity O(1)
 */
PriorityQueue.prototype.isEmpty = function() {
  return this.length === 0;
};

/**
 * Peeks at the top element of the priority queue.
 *
 * @return {Object}
 * @throws {Error} when the queue is empty.
 * @api public
 * @complexity O(1)
 */
PriorityQueue.prototype.peek = function() {
  return _peek.call(this).value;
};

/**
 * Dequeues the top element of the priority queue.
 *
 * @return {Object}
 * @throws {Error} when the queue is empty.
 * @api public
 * @complexity O(log(k)) where `k` === this._elements.length
 */
PriorityQueue.prototype.dequeue = function() {
  var obj = _peek.call(this)
  var top = obj.value
  if (obj.queue) {
    var last = obj.queue.pop();
    var size = obj.queue.length;

    if (size > 0) {
      this._elements[0] = last;
      _sink(obj.queue, 0, size, this._comparator);
    }
  } else {
    this._elements.pop();
  }

  this.length--;
  return top;
};

/**
 * Enqueues the `element` at the priority queue and returns its new size.
 *
 * @param {Object} element
 * @return {Number}
 * @api public
 * @complexity O(log(n)) where `k` === this._elements.length
 */
PriorityQueue.prototype.enqueue = function(element) {
  var n = this._elements.length - 1;
  if (this._begin_sorted > n) {
    this._elements.push(element);
    _swim(this._elements, this._begin_sorted, this._comparator);
    this._begin_sorted++;
  } else if (!this._comparator(element, this._elements[n])) {
    this._temp.push(element);
    _swim(this._temp, this._temp.lenght - 1, this._comparator);
  } else {
    this._elements.push(element);
  }
  this.length++;

  return this.length;
};

/**
 *  Iterates over queue elements
 *
 *  @param {Function: this x Object x index -> undefined} fn
 *  @param {boolean} sorted=true
 *  @complexity O(k * log(k) + n) 
 *    where `k` === this._elements.length and `n` === this.sorted_elements.length - this._index
 */
PriorityQueue.prototype.forEach = function(fn, ordered) {
  if (ordered === undefined)
    ordered = true // true by default

  var index = 0;
  if (ordered) {
    var sorted_array = []
    var size = this.length
    while (index < size) {
      var obj = _peek.call(this);
      if (obj.queue === obj._temp) {} 
    }
    for (var i = this._elements.length - 1; i >= this._begin_sorted; i--) {
      var top = this._elements[i];
      fn.call(this, top, index);
    }
    while (!this.isEmpty()) {
      var obj = _peek.call(this)
      var first = this.dequeue();
      fn.call(this, first, index);
      sorted_array.push(first);
      index++;
    }
    this._sorted_elements = sorted_array;
    this._elements = [];
    this._index = 0;
  } else {
    var i, n, item;

    n = this._elements.length;
    for (i = 0; i < n; i++) {
      item = this._elements[i];
      fn.call(this, item, index);
      index++
    }

    n = this._sorted_elements.length;
    for (i = this._index; i < n; i++) {
      var first = this._sorted_elements[i];
      fn.call(this, first, index);
      index++;
    }
  }
  this.length = this._sorted_elements.length
};

/**
 * Compares the values at position `a` and `b` in the priority queue using its
 * comparator function.
 *
 * @param {Number} a
 * @param {Number} b
 * @return {Number}
 * @api private
 */
var _compare = function(queue, a, b) {
  return this._comparator(queue[a], queue[b]);
};

/**
 * Swaps the values at position `a` and `b` in the priority queue.
 *
 * @param {Number} a
 * @param {Number} b
 * @api private
 * @complexity O(1)
 */
var _swap = function(queue, a, b) {
  var aux = queue[a];
  queue[a] = queue[b];
  queue[b] = aux;
};

/**
 * sink element in `current` position of this._element in accurate position of queue
 *
 * @param {Number} a
 * @param {Number} b
 * @api private
 * @complexity O(log(n))
 */
var _sink = function (queue, current, size, comparator) {
  while (current < size) {
    var largest = current;
    var left = (2 * current) + 1;
    var right = (2 * current) + 2;

    if (left < size && comparator(queue[left], queue[largest]) > 0) {
      largest = left;
    }

    if (right < size && comparator(queue[right], queue[largest]) > 0) {
      largest = right;
    }

    if (largest === current) break;

    _swap(queue, largest, current);
    current = largest;
  }
}


/**
 * swim element in `current` position of queue in accurate position of queue
 *
 * @param {Number} a
 * @param {Number} b
 * @api private
 * @complexity O(log(n))
 */
var _swim = function (queue, current, comparator) {
  while (current > 0) {
    var parent = Math.floor((current - 1) / 2);

    if (comparator(queue[current], queue[parent]) < 0) break;

    _swap(queue, parent, current);
    current = parent;
  }
}

var _peek = function () {
  if (this.length === 0) throw new Error('PriorityQueue is empty');

  var obj = {}
  var a
  var b = this._temp[0]
  if (this._begin_sorted < this._elements.length) {
    a = this._elements[this._elements.length - 1];
  } else {
    a = this._elements[0];
    obj.queue = this._elements;
  }
  if (b === undefined || (a !== undefined) && this._comparator(a, b) >= 0) {
    obj.value = a
  } else {
    obj.queue = this._temp
    obj.value = b
  }

  return obj
}

