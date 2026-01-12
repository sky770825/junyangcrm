import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'
import { parseExcelFile, normalizeTags } from '@/app/lib/utils/excel'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: '請選擇文件' },
        { status: 400 }
      )
    }

    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      return NextResponse.json(
        { error: '只支持 Excel 文件 (.xlsx, .xls)' },
        { status: 400 }
      )
    }

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse Excel
    const excelData = parseExcelFile(buffer)

    if (excelData.length === 0) {
      return NextResponse.json(
        { error: 'Excel 文件中沒有有效數據' },
        { status: 400 }
      )
    }

    // Transform to database format
    const clients = excelData.map(row => ({
      name: row.name,
      phone: row.phone || null,
      tags: normalizeTags(row.tags),
      notes: row.notes || null,
    }))

    // Insert to database
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('clients')
      .insert(
        clients.map(client => ({
          name: client.name,
          phone: client.phone,
          tags: client.tags,
          notes: client.notes,
          status: 'active'
        }))
      )
      .select()

    if (error) throw error

    return NextResponse.json({
      success: true,
      count: data.length,
      clients: data
    })
  } catch (error) {
    console.error('Error uploading clients:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上傳失敗' },
      { status: 500 }
    )
  }
}
