import { Document, Model } from "mongoose";

interface MonthData {
  month: string;
  count: number;
}

export async function generateLast12MonthsData<T extends Document>(
  model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
  const last12Months: MonthData[] = [];
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  
  for (let i = 11; i >= 0; i--) {
    const endDate = new Date(
      Date.UTC(
        currentDate.getUTCFullYear(),
        currentDate.getUTCMonth(),
        currentDate.getUTCDate() - i * 28
      )
    );
    
    const startdate = new Date(
      Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate() - 28
      )
    );
  
  
    // console.log(`Querying for: ${startdate} to ${endDate}`);

    const monthYear = endDate.toLocaleDateString("default", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC", // Specify UTC timezone
    });
    const count = await model.countDocuments({
      createdAt: {
        $gte: startdate,
        $lt: endDate,
      },
    });
    last12Months.push({ month: monthYear, count });

    // console.log(`Count for ${monthYear}: ${count}`);
  }
  

  return { last12Months };
}
