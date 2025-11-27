const Property = require("../models/Property");
const Unit = require("../models/Unit");
const Tenant = require("../models/Tenant");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

exports.getDashboardStats = async (req, res) => {
  try {
    // ------------------------------
    //  BASIC TOTALS
    // ------------------------------
    const totalProperties = await Property.countDocuments();
    const totalUnits = await Unit.countDocuments();
    const totalTenants = await Tenant.countDocuments({ isActive: true });

    // Units breakdown
    const occupiedUnits = await Unit.countDocuments({ isOccupied: true });
    const emptyUnits = totalUnits - occupiedUnits;

    // ------------------------------
    //  MONTHLY REVENUE (LAST 12 MONTHS)
    // ------------------------------
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const monthlyRevenue = await Payment.aggregate([
      { $match: { date: { $gte: oneYearAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalAmount: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // ------------------------------
    //  TOTAL REVENUE
    // ------------------------------
    const totalRevenueAgg = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    // ------------------------------
    //  TOP PROPERTIES BY OCCUPANCY
    // ------------------------------
    const topProperties = await Unit.aggregate([
      {
        $group: {
          _id: "$property",
          totalUnits: { $sum: 1 },
          occupiedUnits: { $sum: { $cond: ["$isOccupied", 1, 0] } }
        }
      },
      {
        $project: {
          totalUnits: 1,
          occupiedUnits: 1,
          occupancyRate: {
            $cond: [
              { $eq: ["$totalUnits", 0] },
              0,
              { $divide: ["$occupiedUnits", "$totalUnits"] }
            ]
          }
        }
      },
      { $sort: { occupancyRate: -1 } },
      { $limit: 5 }
    ]);

    // ------------------------------
    //  OVERDUE PAYMENTS
    // ------------------------------
    const overduePayments = await Payment.countDocuments({ status: "overdue" });

    // ------------------------------
    //  LATEST TENANTS
    // ------------------------------
    const latestTenants = await Tenant.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("unit property");

    // ------------------------------
    //  LATEST BOOKINGS
    // ------------------------------
    const latestBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property tenant");

    // ------------------------------
    //  FINAL RESPONSE
    // ------------------------------
    res.status(200).json({
      totals: {
        totalProperties,
        totalUnits,
        occupiedUnits,
        emptyUnits,
        totalTenants,
        totalRevenue,
      },
      revenueMonthly: monthlyRevenue,
      analytics: {
        topProperties,
        overduePayments,
      },
      recent: {
        latestTenants,
        latestBookings,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
