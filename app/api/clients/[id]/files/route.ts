import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

// 添加文件 URL 到客户记录
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const { url, type } = await request.json() // type: 'photo' | 'video' | 'document'

    if (!url || !type) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 获取当前客户数据
    const { data: client, error: fetchError } = await supabase
      .from('clients')
      .select('photos, videos, documents')
      .eq('id', id)
      .single()

    if (fetchError || !client) {
      return NextResponse.json(
        { error: '客户不存在' },
        { status: 404 }
      )
    }

    // 根据类型添加到对应数组
    let updateData: any = {}
    if (type === 'photo') {
      updateData.photos = [...(client.photos || []), url]
    } else if (type === 'video') {
      updateData.videos = [...(client.videos || []), url]
    } else if (type === 'document') {
      updateData.documents = [...(client.documents || []), url]
    } else {
      return NextResponse.json(
        { error: '无效的文件类型' },
        { status: 400 }
      )
    }

    // 更新客户记录
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error adding file to client:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '添加文件失败' },
      { status: 500 }
    )
  }
}

// 从客户记录中删除文件 URL
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const { url, type } = await request.json()

    if (!url || !type) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      )
    }

    // 获取当前客户数据
    const { data: client, error: fetchError } = await supabase
      .from('clients')
      .select('photos, videos, documents')
      .eq('id', id)
      .single()

    if (fetchError || !client) {
      return NextResponse.json(
        { error: '客户不存在' },
        { status: 404 }
      )
    }

    // 从对应数组中移除 URL
    let updateData: any = {}
    if (type === 'photo') {
      updateData.photos = (client.photos || []).filter((u: string) => u !== url)
    } else if (type === 'video') {
      updateData.videos = (client.videos || []).filter((u: string) => u !== url)
    } else if (type === 'document') {
      updateData.documents = (client.documents || []).filter((u: string) => u !== url)
    } else {
      return NextResponse.json(
        { error: '无效的文件类型' },
        { status: 400 }
      )
    }

    // 更新客户记录
    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error removing file from client:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '删除文件失败' },
      { status: 500 }
    )
  }
}
