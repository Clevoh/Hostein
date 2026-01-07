import api from "./api";

/* =========================
   TENANTS
========================= */

// Get all tenants
export const getTenants = async () => {
  const res = await api.get("/tenants");
  return res.data;
};

// Create tenant (NO property/unit here)
export const createTenant = async (data) => {
  const res = await api.post("/tenants", {
    name: data.name,
    email: data.email,
    phone: data.phone,
  });
  return res.data;
};

/* =========================
   UNIT ↔ TENANT ACTIONS
========================= */

// Assign tenant to unit
export const assignTenantToUnit = async (unitId, tenantId) => {
  if (!unitId || !tenantId) {
    throw new Error("Unit ID and Tenant ID are required");
  }

  const res = await api.post(`/units/${unitId}/assign`, {
    tenantId,
  });

  return res.data;
};

// Vacate unit
export const vacateUnit = async (unitId) => {
  if (!unitId) {
    throw new Error("Unit ID is required");
  }

  const res = await api.patch(`/units/${unitId}/vacate`);
  return res.data;
};
