import { v4 as uuidv4 } from 'uuid';
import { GenerateObjectDto } from "../dto/generate-object.dto";

export function generateObject(file: Express.Multer.File): GenerateObjectDto {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const key = uuidv4();
  const type = file.originalname.split('.').pop();

  return {
    objectName: `${year}/${month}/${day}/${key}.${type}`,
    key: key,
    year: year,
    month: month,
    day: day
  }
}
