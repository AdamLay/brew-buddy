export const getAbvEstimate = (ogReading: number) => {
  return "~" + ((ogReading - 1.0) * 131.25).toFixed(1) + "%";
};

export const getAbv = (og: number, fg: number) => {
  return ((og - fg) * 131.25).toFixed(1) + "%";
};
