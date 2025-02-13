import pool from '@/database/db' // Kết nối đến MS SQL Server
import { DepartmentListRes } from '@/schemaValidations/department.schema'

export const getDepartmentList = async () => {
  try {
    // Thực hiện truy vấn SQL để lấy danh sách phòng ban
    const result = await pool.request().query(
      ` SELECT Department_ID, 
                Department_Name, 
                CASE WHEN card_photo IS NULL THEN 'BLUE.PNG' ELSE card_photo END CARD_PHOTO,
                CASE WHEN Branch_ID = 'KCS' THEN 'BKCS' ELSE Factory END Factory,
                Choose_Department
        FROM dbo.Data_Department
        WHERE Department_ID <> ''
            AND Zones = 'B'
            AND Hide = 0
            AND Department_Quit_Job<> 1
        ORDER BY Department_ID`
    )
    // Chuyển đổi dữ liệu từ recordset
    const departments = result.recordset.map((row) => ({
      Department_ID: row.Department_ID,
      Department_Name: row.Department_Name,
      CARD_PHOTO: row.CARD_PHOTO,
      Factory: row.Factory,
      Choose_Department: Boolean(row.Choose_Department) // Chuyển đổi sang boolean
    }))

    return departments
  } catch (error: any) {
    console.error('Error fetching department list:', error.message)
    throw new Error('Failed to fetch department list')
  }
}
