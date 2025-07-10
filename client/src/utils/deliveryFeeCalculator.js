
export const calculateDeliveryFee = (pincode, state, totalWeight) => {
  const basePincode = "831013";
  const currentState = "Jharkhand"; // Set your base state here

  if (pincode === basePincode) {
    return 0;
  }

  if (state === currentState) {
    return 50 + totalWeight * 20;
  } else {
    return 100 + totalWeight * 25;
  }
};
