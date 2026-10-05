import Partner from "./partnerModel.js";
import PartnerSubmission from "./PartnerSubmission.js";

Partner.hasMany(PartnerSubmission, {
  foreignKey: "partnerId",
  as: "submissions",
  onDelete: "CASCADE",
});

PartnerSubmission.belongsTo(Partner, {
  foreignKey: "partnerId",
  as: "partner",
});