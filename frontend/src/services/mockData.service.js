export async function simulateNetwork(payload, delay = 320) {
  await new Promise((resolve) => {
    window.setTimeout(resolve, delay);
  });

  return payload;
}
