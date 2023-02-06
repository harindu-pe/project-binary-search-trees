// helper function to visualize binary tree
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node.rightNode !== null) {
    prettyPrint(node.rightNode, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);
  if (node.leftNode !== null) {
    prettyPrint(node.leftNode, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

// function to create node
function createNode(value = null, leftNode = null, rightNode = null) {
  return {
    value: value,
    leftNode: leftNode,
    rightNode: rightNode,
  };
}

// function to build binary tree
function buildTree(uniqueArray, start = 0, end = uniqueArray.length - 1) {
  // base case
  if (start > end) return null;
  // Get the middle element and make it root
  let mid = parseInt((start + end) / 2);
  const root = createNode(uniqueArray[mid]);
  // Recursively construct the left subtree and make it left child of root
  root.leftNode = buildTree(uniqueArray, start, mid - 1);

  // Recursively construct the right subtree and make it right child of root
  root.rightNode = buildTree(uniqueArray, mid + 1, end);

  return root;
}

// helper function to find min value
function minValue(root) {
  let minv = root.value;
  while (root.leftNode !== null) {
    minv = root.leftNode.value;
    root = root.leftNode;
  }
  return minv;
}

// function to create binary tree
function createTree(array) {
  // Remove duplicates and sort array
  const uniqueArray = [...new Set(array.sort((a, b) => a - b))];

  return {
    root: buildTree(uniqueArray),

    // method to insert new values
    insert(value, root = this.root) {
      // base case
      if (root === null) {
        root = createNode(value);
        return root;
      }

      // if smaller or larger
      if (value < root.value) {
        root.leftNode = this.insert(value, root.leftNode);
      } else if (value > root.value) {
        root.rightNode = this.insert(value, root.rightNode);
      }
      return root;
    },

    // method to delete values
    delete(key, root = this.root) {
      // base case if the tree is empty
      if (root === null) return root;
      // otherwise, recur down the tree
      if (key < root.value) {
        root.leftNode = this.delete(key, root.leftNode);
      } else if (key > root.value) {
        root.rightNode = this.delete(key, root.rightNode);
      }
      // if the key matches the root value
      else {
        // node with only one child or no child
        if (root.leftNode === null) {
          return root.rightNode;
        } else if (root.rightNode === null) {
          return root.leftNode;
        }
        // node with two children: get the inorder successor (smallest in the right subtree)
        root.value = minValue(root.rightNode);
        // delete the inorder successor
        root.rightNode = this.delete(root.value, root.rightNode);
      }
      return root;
    },
    // method to find node
    find(key, root = this.root) {
      // base case
      if (root.value === key || root === null) return root;
      // otherwise, recur down the tree
      if (key < root.value) {
        return this.find(key, root.leftNode);
      } else if (key > root.value) {
        return this.find(key, root.rightNode);
      }
    },
    // levelorder method
    levelOrder(callback) {
      if (!this.root) return [];
      const queue = [this.root];
      const results = [];
      while (queue.length) {
        let level = [];
        let size = queue.length;
        for (let i = 0; i < size; i++) {
          const node = queue.shift();
          level.push(node.value);
          if (node.leftNode) queue.push(node.leftNode);
          if (node.rightNode) queue.push(node.rightNode);
          if (callback) callback(node);
        }
        results.push(level);
      }
      if (!callback) return results;
    },
    // inorder (left, root, right)
    inorder(node = this.root, callback, result = []) {
      if (!this.root) return [];
      if (node === null) return;
      this.inorder(node.leftNode, callback, result);
      callback ? callback(node) : result.push(node.value);
      this.inorder(node.rightNode, callback, result);
      if (result) return result;
    },

    // preorder (root, left, right)
    preorder(callback) {
      if (!this.root) return [];
      const stack = [this.root];
      const results = [];
      while (stack.length) {
        const node = stack.pop();
        if (node.rightNode) stack.push(node.rightNode);
        if (node.leftNode) stack.push(node.leftNode);
        if (callback) callback(node);
        results.push(node.value);
      }
      if (!callback) return results;
    },
    // postorder (left, right, root)
    postorder(callback) {
      if (!this.root) return [];
      const stack = [this.root];
      const results = [];
      while (stack.length) {
        const node = stack.pop();
        if (node.leftNode) stack.push(node.leftNode);
        if (node.rightNode) stack.push(node.rightNode);
        if (callback) callback(node);
        results.push(node.value);
      }
      if (!callback) return results.reverse();
    },

    // height
    height(node = this.root) {
      if (node === null) return -1;
      const leftHeight = this.height(node.leftNode);
      const rightHeight = this.height(node.rightNode);
      return Math.max(leftHeight, rightHeight) + 1;
    },

    // depth
    depth(node, root = this.root, level = 0) {
      if (!node) return null;
      if (root === null) return 0;
      if (root.value === node.value) return level;
      let count = this.depth(node, root.leftNode, level + 1);
      if (count !== 0) return count;
      return this.depth(node, root.rightNode, level + 1);
    },

    // is it balanced
    isBalanced(node = this.root) {
      if (node === null) return true;
      const heightDiff = Math.abs(
        this.height(node.leftNode) - this.height(node.rightNode)
      );
      return (
        heightDiff <= 1 &&
        this.isBalanced(node.leftNode) &&
        this.isBalanced(node.rightNode)
      );
    },

    // rebalance
    rebalance() {
      if (this.root === null) return;
      const sorted = [...new Set(this.inorder().sort((a, b) => a - b))];
      this.root = buildTree(sorted);
    },
  };
}

// const tree = createTree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
// visualize binary tree
// prettyPrint(tree.root);
// tree.insert(24);
// tree.delete(8);
// prettyPrint(tree.root);
// console.log(tree.find(324));
// console.log(tree.levelOrder());
// console.log(tree.inorder());
// console.log(tree.preorder());
// console.log(tree.postorder());
// console.log(tree.height(tree.find(324)));
// console.log(tree.depth(tree.find(1)));

const randomArray = (size) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
};

const tree = createTree(randomArray(10));
console.log("Balanced:", tree.isBalanced());
console.log("Lever Order =>", tree.levelOrder());
console.log("Preorder =>", tree.preorder());
console.log("Inorder =>", tree.inorder());
console.log("Postorder =>", tree.postorder());

for (let i = 0; i < 5; i++) {
  tree.insert(Math.floor(Math.random() * 20));
}
console.log("Balanced:", tree.isBalanced());

tree.rebalance();
console.log("Balanced:", tree.isBalanced());
console.log("Lever Order =>", tree.levelOrder());
console.log("Preorder =>", tree.preorder());
console.log("In-order =>", tree.inorder());
console.log("Post-order =>", tree.postorder());
