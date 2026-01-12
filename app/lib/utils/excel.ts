import * as XLSX from 'xlsx'
import type { ClientTag } from '@/app/types/database'

export interface ExcelClientRow {
  name: string
  phone?: string
  tags?: string
  notes?: string
}

export function parseExcelFile(buffer: Buffer): ExcelClientRow[] {
  try {
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(worksheet) as any[]

    const parsedData: ExcelClientRow[] = []
    
    for (const row of data) {
      // Map common column names
      const name = row['姓名'] || row['name'] || row['Name'] || row['客戶名稱'] || row['客戶'] || ''
      const phone = row['電話'] || row['phone'] || row['Phone'] || row['聯絡電話'] || ''
      const tags = row['標籤'] || row['tags'] || row['Tags'] || row['分類'] || ''
      const notes = row['備註'] || row['notes'] || row['Notes'] || row['說明'] || ''

      if (!name || name.toString().trim() === '') {
        continue
      }

      parsedData.push({
        name: name.toString().trim(),
        phone: phone ? phone.toString().trim() : undefined,
        tags: tags ? tags.toString().trim() : undefined,
        notes: notes ? notes.toString().trim() : undefined,
      })
    }
    
    return parsedData
    
    return parsedData
  } catch (error) {
    throw new Error(`解析Excel文件失敗: ${error instanceof Error ? error.message : '未知錯誤'}`)
  }
}

export function normalizeTags(tags?: string): ClientTag[] {
  if (!tags) return []
  
  const tagArray = tags.split(/[,，]/).map(t => t.trim().toUpperCase())
  const validTags: ClientTag[] = ['A-Hot', 'B-Warm', 'C-Cold', 'D-Invalid']
  
  return tagArray.filter(tag => {
    // Support both Chinese and English tags
    if (tag === 'A' || tag === 'HOT' || tag === '熱') return true
    if (tag === 'B' || tag === 'WARM' || tag === '溫') return true
    if (tag === 'C' || tag === 'COLD' || tag === '冷') return true
    if (tag === 'D' || tag === 'INVALID' || tag === '無效') return true
    return validTags.includes(tag as ClientTag)
  }).map(tag => {
    // Normalize to standard format
    if (tag === 'A' || tag === 'HOT' || tag === '熱') return 'A-Hot'
    if (tag === 'B' || tag === 'WARM' || tag === '溫') return 'B-Warm'
    if (tag === 'C' || tag === 'COLD' || tag === '冷') return 'C-Cold'
    if (tag === 'D' || tag === 'INVALID' || tag === '無效') return 'D-Invalid'
    return tag as ClientTag
  }) as ClientTag[]
}
