import TimestampModel from "../models/sports/timestamp.model";

export const getTimestamp = async (where: object) => {
  try {
    const timestampData = await TimestampModel.findOne(where, { _id: 0, ts: 1 });
    return timestampData;
  } catch (err) {
    console.error(err);
  }
}

export const addTimestamp = async (key: string, type: string, ts: string) => {
  try {
    const newTimestamp = new TimestampModel({
      sportsName: key,
      type: type,
      ts: ts,
      updatedAt: new Date()
    });

    await newTimestamp.save();
  } catch (err) {
    console.error('Add timestamp error: ', err);
  }
}

export const updateTimestamp = async (sportsName: string, type: string, timestamp: string) => {
  try {
    await TimestampModel.updateOne(
      {
        sportsName: sportsName,
        type: type
      },
      {
        $set: {
          ts: timestamp,
          updatedAt: new Date()
        }
      }
    );

  } catch (err) {
    console.error('Add timestamp error: ', err);
  }
}