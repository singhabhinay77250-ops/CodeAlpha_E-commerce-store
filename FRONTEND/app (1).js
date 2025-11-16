const productsContainer = document.getElementById('products-container');

async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    displayProducts(products);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

function displayProducts(products) {
  productsContainer.innerHTML = '';

  products.forEach((product) => {
    const productElement = document.createElement('div');
    productElement.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p>Price: $${product.price}</p>
      <p>Category: ${product.category}</p>
      <button onclick="editProduct('${product._id}', '${product.name}', '${product.description}', ${product.price}, '${product.category}')">Edit</button>
      <button onclick="deleteProduct('${product._id}')">Delete</button>
    `;
    productsContainer.appendChild(productElement);
  });
}

async function editProduct(id, name, description, price, category) {
  const newName = prompt('Enter new name:', name);
  const newDescription = prompt('Enter new description:', description);
  const newPrice = parseFloat(prompt('Enter new price:', price));
  const newCategory = prompt('Enter new category:', category);

  if (newName && newDescription && !isNaN(newPrice) && newCategory) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          price: newPrice,
          category: newCategory,
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating product');
      }

      fetchProducts(); // Refresh the product list after update
    } catch (error) {
      console.error('Error updating product:', error);
    }
  } else {
    alert('Please provide valid information');
  }
}

async function deleteProduct(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error deleting product');
      }

      fetchProducts(); // Refresh the product list after delete
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
}

fetchProducts();
