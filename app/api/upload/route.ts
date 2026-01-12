import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/app/lib/r2/client'

export async function POST(request: NextRequest) {
  try {
    // 检查 R2 配置
    if (!R2_BUCKET_NAME || !R2_PUBLIC_URL) {
      return NextResponse.json(
        { error: 'R2 配置未完成，请设置环境变量' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'uploads'

    if (!file) {
      return NextResponse.json(
        { error: '请选择文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的文件类型。仅支持图片和视频文件' },
        { status: 400 }
      )
    }

    // 验证文件大小（最大 100MB）
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '文件大小超过 100MB 限制' },
        { status: 400 }
      )
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop()
    const key = `${folder}/${timestamp}-${randomStr}.${extension}`

    // 读取文件内容
    const buffer = Buffer.from(await file.arrayBuffer())

    // 上传到 R2
    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // 如果需要公开访问，可以设置 ACL
      // ACL: 'public-read',
    }))

    // 返回文件 URL
    const url = `${R2_PUBLIC_URL}/${key}`

    return NextResponse.json({
      success: true,
      url,
      key,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '上传失败' },
      { status: 500 }
    )
  }
}
