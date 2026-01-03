import api from "./api";

export const assignTenantToUnit = (unitId, tenantId) =>
  api.post(`/units/${unitId}/assign`, { tenantId });

export const vacateUnit = (unitId) =>
  api.post(`/units/${unitId}/vacate`);
