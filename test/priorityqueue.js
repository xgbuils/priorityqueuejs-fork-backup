function constructSampleQueue() {
  var queue = new PriorityQueue(['a', 'b', 'd']);
  queue.forEach(function() {});
  queue.enqueue('c')
  queue.enqueue('e')
  queue.enqueue('b')

  return queue
}

describe('PriorityQueue()', function() {
  it('returns an new PriorityQueue', function() {
    expect(new PriorityQueue()).to.be.a(PriorityQueue);
  });

  it('accepts a comparator function', function() {
    var queue = new PriorityQueue(function(a, b) {
      return a - b;
    });

    expect(queue).to.be.a(PriorityQueue);
  });

  describe('.DEFAULT_COMPARATOR()', function() {
    context('given strings', function() {
      it('returns a negative number when a < b', function() {
        expect(PriorityQueue.DEFAULT_COMPARATOR('jano', 'valentina')).to.be.
          below(0);
      });

      it('returns 0 number when a == b', function() {
        expect(PriorityQueue.DEFAULT_COMPARATOR('jano', 'jano')).to.be(0);
      });

      it('returns a positive number when a > b', function() {
        expect(PriorityQueue.DEFAULT_COMPARATOR('jano', 'fran')).to.be.
          above(0);
      });
    });

    context('given numbers', function() {
      it('returns a negative number when a < b', function() {
        expect(PriorityQueue.DEFAULT_COMPARATOR(10, 1000)).to.be.below(0);
      });

      it('returns 0 number when a == b', function() {
        expect(PriorityQueue.DEFAULT_COMPARATOR(10, 10)).to.be(0);
      });

      it('returns a positive number when a > b', function() {
        expect(PriorityQueue.DEFAULT_COMPARATOR(10, 1)).to.be.above(0);
      });
    });
  });

  describe('#isEmpty()', function() {
    it('returns true when the queue is empty', function() {
      var queue = new PriorityQueue();
      expect(queue.isEmpty()).to.be(true);
    });

    it('returns false when the queue is not empty', function() {
      var queue = new PriorityQueue();
      queue.enqueue('jano');
      expect(queue.isEmpty()).to.be(false);
    });
  });

  describe('#peek()', function() {
    it('fails when the queue is empty', function() {
      var queue = new PriorityQueue();
      expect(function() {
        queue.peek();
      }).to.throwException('PriorityQueue is empty');
    });

    it('returns the top element of the queue', function() {
      var queue = new PriorityQueue();
      queue.enqueue('jano');
      queue.enqueue('valentina');
      queue.enqueue('zombie');
      queue.enqueue('fran');
      queue.enqueue('albert');
      queue.enqueue('albert');
      queue.enqueue('frank');
      expect(queue.peek()).to.be('zombie');
    });
  });

  describe('#deq()', function() {
    it('fails when the queue is empty', function() {
      var queue = new PriorityQueue();
      expect(function() {
        queue.dequeue();
      }).to.throwException('PriorityQueue is empty');
    });

    it('dequeues the top element of the queue', function() {
      var queue = new PriorityQueue();
      queue.enqueue('jano');
      queue.enqueue('valentina');
      queue.enqueue('zombie');
      queue.enqueue('fran');
      queue.enqueue('albert');
      queue.enqueue('albert');
      queue.enqueue('frank');
      queue.enqueue('jano');
      queue.enqueue('valentina');
      queue.enqueue('zombie');
      expect(queue.dequeue()).to.be('zombie');
      expect(queue.dequeue()).to.be('zombie');
      expect(queue.dequeue()).to.be('valentina');
      expect(queue.dequeue()).to.be('valentina');
      expect(queue.dequeue()).to.be('jano');
      expect(queue.dequeue()).to.be('jano');
      expect(queue.dequeue()).to.be('frank');
      expect(queue.dequeue()).to.be('fran');
      expect(queue.dequeue()).to.be('albert');
      expect(queue.dequeue()).to.be('albert');
      expect(queue.isEmpty()).to.be(true);
    });

    it('not fails with only one element', function() {
      var queue = new PriorityQueue();
      queue.enqueue('jano');
      expect(queue.dequeue()).to.be('jano');
      expect(queue.length).to.be(0);
    });

    it('works with custom comparators', function() {
      var queue = new PriorityQueue(function(a, b) {
        return b.priority - a.priority;
      });

      queue.enqueue({ priority: 100 });
      queue.enqueue({ priority: -1 });
      queue.enqueue({ priority: 0 });
      queue.enqueue({ priority: 5 });
      expect(queue.dequeue()).to.be.eql({ priority: -1 });
      expect(queue.dequeue()).to.be.eql({ priority: 0 });
      expect(queue.dequeue()).to.be.eql({ priority: 5 });
      expect(queue.dequeue()).to.be.eql({ priority: 100 });
      expect(queue.isEmpty()).to.be(true);
    });
/*
    it('dequeues seven elements in queue of six elements', function () {
      var queue = constructSampleQueue();
      //console.log(queue._elements, queue._sorted_elements.slice(queue._index))
      expect(queue.dequeue()).to.be.eql('e');
      //console.log(queue._elements, queue._sorted_elements.slice(queue._index))
      expect(queue.dequeue()).to.be.eql('d');
      //console.log(queue._elements, queue._sorted_elements.slice(queue._index))
      expect(queue.dequeue()).to.be.eql('c');
      //console.log(queue._elements, queue._sorted_elements.slice(queue._index))
      expect(queue.dequeue()).to.be.eql('b');
      //console.log(queue._elements, queue._sorted_elements.slice(queue._index))
      expect(queue.dequeue()).to.be.eql('b');
      //console.log(queue._elements, queue._sorted_elements.slice(queue._index))
      expect(queue.dequeue()).to.be.eql('a');
      //console.log(queue._elements, queue._sorted_elements.slice(queue._index))
      expect(function() {
        queue.dequeue();
      }).to.throwException('PriorityQueue is empty');
    });*/
  });

  describe('#enq()', function() {
    it('enqueues an element at the end of the queue', function() {
      var queue = new PriorityQueue();
      queue.enqueue('jano');
      queue.enqueue('valentina');
      queue.enqueue('fran');
      expect(queue.peek()).to.be('valentina');
      expect(queue.length).to.be(3);
    });

    it('returns the new size of the queue', function() {
      var queue = new PriorityQueue();
      expect(queue.enqueue('jano')).to.be(1);
    });

    it('works with custom comparators', function() {
      var queue = new PriorityQueue(function(a, b) {
        return b.priority - a.priority;
      });

      queue.enqueue({ priority: 100 });
      queue.enqueue({ priority: -1 });
      queue.enqueue({ priority: 0 });
      queue.enqueue({ priority: 5 });
      expect(queue.peek()).to.be.eql({ priority: -1 });
      expect(queue.length).to.be(4);
    });
  });

  describe('#length', function() {
    it('returns 0 when the queue is empty', function() {
      var queue = new PriorityQueue();
      expect(queue.length).to.be(0);
    });

    it('returns the size of the queue', function() {
      var queue = new PriorityQueue();
      queue.enqueue('jano');
      queue.enqueue('valentina');
      expect(queue.length).to.be(2);
    });
  });

  describe('#constructor()', function() {
    it('create a empty priority queue', function () {
      var queue = new PriorityQueue([]);

      expect(queue.isEmpty()).to.be(true);
    });

    it('create a priority queue based on array', function () {
      var queue = new PriorityQueue([3,4,1,7,6,4]);
      var sorted_array = [];

      while (!queue.isEmpty()) {
        sorted_array.push(queue.dequeue());
      }

      expect(sorted_array[0]).to.be(7);
      expect(sorted_array[1]).to.be(6);
      expect(sorted_array[2]).to.be(4);
      expect(sorted_array[3]).to.be(4);
      expect(sorted_array[4]).to.be(3);
      expect(sorted_array[5]).to.be(1);
    });

    it('create a priority queue based on array and custom comparator', function () {
      var queue = new PriorityQueue([3,4,1,7,6,4], function (a, b) {
        return b - a
      });
      var sorted_array = [];

      while (!queue.isEmpty()) {
        sorted_array.push(queue.dequeue());
      }

      expect(sorted_array[0]).to.be(1);
      expect(sorted_array[1]).to.be(3);
      expect(sorted_array[2]).to.be(4);
      expect(sorted_array[3]).to.be(4);
      expect(sorted_array[4]).to.be(6);
      expect(sorted_array[5]).to.be(7);
    });
  });
/*
  describe('#forEach()', function() {
    var queue = new PriorityQueue(['a', 'b', 'd'])

    function expectForEach (iteration, iteration_expected, length_expected) {
      iteration.forEach(function (item, index) {
        expect(item[1]).to.be.eql(index);
        expect(item[0]).to.be.eql(iteration_expected[index])
      });
    }

    it('iterates over all queue elements in order (1)', function () {
      var iteration = [];

      queue.forEach(function(element, index) {
        iteration.push([element, index]);
      });

      expectForEach(iteration, ['d', 'b', 'a'], 3)
    });

    it('iterates over all queue elements in order (2)', function () {
      var iteration = [];

      queue.forEach(function(element, index) {
        iteration.push([element, index]);
      });

      expectForEach(iteration, ['d', 'b', 'a'], 3)
    });

    it('enqueues three elements at the end of the queue', function () {
      queue.enqueue('c')
      queue.enqueue('e')
      queue.enqueue('b')
      expect(queue.length).to.be(6);
    });

    it('iterates over all queue elements in order (3)', function () {
      var iteration = [];

      queue.forEach(function(element, index) {
        iteration.push([element, index]);
      });

      expectForEach(iteration, ['e', 'd', 'c', 'b', 'b', 'a'], 6)
    });

    it('dequeues the top element of the queue', function() {
      var top = queue.dequeue()
      expect(top).to.be('e');
    });

    it('iterates over all queue elements in order (4)', function () {
      var iteration = [];

      queue.forEach(function(element, index) {
        iteration.push([element, index]);
      });

      expectForEach(iteration, ['d', 'c', 'b', 'b', 'a'], 5)
    });

    it('dequeues two elements of the queue and iterates over all queue elements in order', function() {
      var q = constructSampleQueue()
      var top
      top = q.dequeue()
      expect(top).to.be('e');
      top = q.dequeue()
      expect(top).to.be('d');

      var iteration = [];

      q.forEach(function(element, index) {
        iteration.push([element, index]);
      });

      expectForEach(iteration, ['c', 'b', 'b', 'a'], 4)
    });

    it('dequeues three elements of the queue and iterates over all queue elements in order', function() {
      var q = constructSampleQueue()
      var top
      top = q.dequeue()
      expect(top).to.be('e');
      top = q.dequeue()
      expect(top).to.be('d');
      top = q.dequeue()
      expect(top).to.be('c');

      var iteration = []

      q.forEach(function(element, index) {
        iteration.push([element, index]);
      });

      expectForEach(iteration, ['b', 'b', 'a'], 3)
    });

  });*/
});
