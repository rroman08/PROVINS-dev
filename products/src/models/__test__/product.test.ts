import { Product } from '../product';

it ('implements optimistic concurrency control (OCC)', async () => {
  const product = Product.build({
    title: 'Running Shoes',
    price: 99.99,
    userId: 'testtesttest',
  });
  await product.save();
  // Fetch product twice
  const firstInstance = await Product.findById(product.id);
  const secondInstance = await Product.findById(product.id);  
  // Make two separate changes to the fetched products
  firstInstance!.set({ price: 109.99 });
  secondInstance!.set({ price: 77.99 });
  // Save first fetched product
  await firstInstance!.save();
  // Save second fetched product (must have outdated version)
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('>>>This should not be reached<<<');
});

it ('increments version correctly', async () => {
  const product = Product.build({
    title: 'Running Shoes',
    price: 99.99,
    userId: 'testtesttest',
  });
  await product.save();
  expect(product.version).toEqual(0);
  await product.save();
  expect(product.version).toEqual(1);
  await product.save();
  expect(product.version).toEqual(2);
});
