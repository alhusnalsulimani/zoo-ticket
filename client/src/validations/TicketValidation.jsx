import * as yup from "yup";

const priceRuleTest = yup.object().test("price-rule", function (values) {
  const { adult, child, group } = values || {};

  const hasGroup = group != null;
  const hasAdult = adult != null;
  const hasChild = child != null;

  if (hasGroup && (hasAdult || hasChild)) {
    return this.createError({
      path: "group",
      message: "Use either Group OR Adult/Child prices, not both",
    });
  }

  if (!hasGroup && !hasAdult && !hasChild) {
    return this.createError({
      path: "adult",
      message: "At least one price is required",
    });
  }

  return true;
});

const groupStockRuleTest = yup.object().test("group-stock-rule", function (values) {
  const { group, stock, adult, child } = values || {};

  const isGroupOnly =
    group != null && adult == null && child == null;

  if (isGroupOnly) {
    if (stock < 10) {
      return this.createError({
        path: "stock",
        message: "Stock must be at least 10 for group tickets",
      });
    }
    if (stock % 10 !== 0) {
      return this.createError({
        path: "stock",
        message: "Stock must be a multiple of 10 (10, 20, 30...)",
      });
    }
  }

  return true;
});

const sharedFields = {
  name: yup
    .string()
    .required("Ticket name is required")
    .min(3, "Minimum 3 characters"),

  stock: yup
    .number()
    .required("Stock is required")
    .typeError("Stock must be a number")
    .min(0, "Stock cannot be negative"),

  adult: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .min(0, "Must be >= 0"),

  child: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .min(0, "Must be >= 0"),

  group: yup
    .number()
    .nullable()
    .transform((v, o) => (o === "" ? null : v))
    .min(0, "Must be >= 0"),
};

// FULL SCHEMA — used by AddTicket (description + picture required)
export const ticketSchema = yup
  .object()
  .shape({
    ...sharedFields,
    description: yup.string().required("Description is required"),
    picture_link: yup
      .string()
      .required("Image URL is required")
      .url("Must be a valid URL"),
  })
  .test("price-rule", function (values) {
    const { adult, child, group } = values || {};
    const hasGroup = group != null;
    const hasAdult = adult != null;
    const hasChild = child != null;

    if (hasGroup && (hasAdult || hasChild)) {
      return this.createError({
        path: "group",
        message: "Use either Group OR Adult/Child prices, not both",
      });
    }
    if (!hasGroup && !hasAdult && !hasChild) {
      return this.createError({
        path: "adult",
        message: "At least one price is required",
      });
    }
    return true;
  })
  .test("group-stock-rule", function (values) {
    const { group, stock, adult, child } = values || {};
    const isGroupOnly = group != null && adult == null && child == null;

    if (isGroupOnly) {
      if (stock < 10) {
        return this.createError({
          path: "stock",
          message: "Stock must be at least 10 for group tickets",
        });
      }
      if (stock % 10 !== 0) {
        return this.createError({
          path: "stock",
          message: "Stock must be a multiple of 10 (10, 20, 30...)",
        });
      }
    }
    return true;
  });

// EDIT SCHEMA — used by EditTicket
export const editTicketSchema = yup
  .object()
  .shape({
    ...sharedFields,
    description: yup.string().optional(),
    picture_link: yup.string().optional().url("Must be a valid URL"),
  })
  .test("price-rule", function (values) {
    const { adult, child, group } = values || {};
    const hasGroup = group != null;
    const hasAdult = adult != null;
    const hasChild = child != null;

    if (hasGroup && (hasAdult || hasChild)) {
      return this.createError({
        path: "group",
        message: "Use either Group OR Adult/Child prices, not both",
      });
    }
    if (!hasGroup && !hasAdult && !hasChild) {
      return this.createError({
        path: "adult",
        message: "At least one price is required",
      });
    }
    return true;
  })
  .test("group-stock-rule", function (values) {
    const { group, stock, adult, child } = values || {};
    const isGroupOnly = group != null && adult == null && child == null;

    if (isGroupOnly) {
      if (stock < 10) {
        return this.createError({
          path: "stock",
          message: "Stock must be at least 10 for group tickets",
        });
      }
      if (stock % 10 !== 0) {
        return this.createError({
          path: "stock",
          message: "Stock must be a multiple of 10 (10, 20, 30...)",
        });
      }
    }
    return true;
  });