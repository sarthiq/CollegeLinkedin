exports.cleanupOldRecords = async (model, limit, options = {}) => {
  try {
    // Get total count
    const totalCount = await model.count({
      where: options.where || {},
    });

    if (totalCount > limit) {
      // Calculate how many records to delete
      const deleteCount = totalCount - limit;

      // Get IDs of records to delete (oldest first)
      const recordsToDelete = await model.findAll({
        where: options.where || {},
        order: [[options.orderBy || "createdAt", "ASC"]],
        limit: deleteCount,
        attributes: ["id"],
        raw: true,
      });

      // Delete the old records
      const deletedCount = await model.destroy({
        where: {
          id: recordsToDelete.map((record) => record.id),
        },
      });

      return deletedCount;
    }

    return 0;
  } catch (error) {
    console.error("Cleanup operation failed:", error);
    throw error;
  }
};
