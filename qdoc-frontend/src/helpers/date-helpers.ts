import moment from "moment";

export const formatDate = (rawDate: Date | string, format = "MMMM Do YYYY, h:mm:ss a"): string => {
  return moment(rawDate).format(format);
};
