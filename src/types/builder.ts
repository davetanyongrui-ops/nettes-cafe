export type BlockType = 'text' | 'image' | 'spacer' | 'divider'

export interface BlockStyle {
    fontSize?: string
    color?: string
    textAlign?: 'left' | 'center' | 'right' | 'justify'
    fontWeight?: string
    padding?: string
    height?: string
}

export interface PageBlock {
    id: string
    type: BlockType
    content: string
    style?: BlockStyle
}

export interface CustomPage {
    id: string
    slug: string
    title: string
    blocks: PageBlock[]
    created_at: string
    updated_at: string
}
