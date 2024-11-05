"use strict";

class MinHeap {
  constructor() {
    this.heap = [];
  }

  insert(node) {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin() {
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (
        new Date(this.heap[index].value.date) >=
        new Date(this.heap[parentIndex].value.date)
      )
        break;
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      let leftIndex = 2 * index + 1;
      let rightIndex = 2 * index + 2;
      let smallest = index;

      if (
        leftIndex < length &&
        this.heap[leftIndex].value.date < this.heap[smallest].value.date
      ) {
        smallest = leftIndex;
      }
      if (
        rightIndex < length &&
        this.heap[rightIndex].value.date < this.heap[smallest].value.date
      ) {
        smallest = rightIndex;
      }
      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }
}

// Print all entries, across all of the *async* sources, in chronological order.

async function asyncMergeSortedLogs(logObjects) {
  return new Promise(async (resolve) => {
    try {
      resolve(sortedDates);
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = (logSources, printer) => {
  return new Promise(async (resolve, reject) => {
    try {
      const heap = new MinHeap();

      for (const logObject of logSources) {
        const log = await logObject.popAsync();
        if (log) {
          heap.insert({ value: log, logObject });
        }
      }

      while (!heap.isEmpty()) {
        const { value, logObject } = heap.extractMin();
        printer.print(value);

        // Fetch the next date from the same obj.
        const log = await logObject.popAsync();
        if (log) {
          heap.insert({ value: log, logObject });
        }
      }
      printer.done();
      resolve(console.log("Async sort complete."));
    } catch (e) {
      reject(e);
    }
  });
};
