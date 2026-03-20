import clientPromise from './mongodb'

export interface StylingPair {
  productId: string;
  productType: string;
  pairsWellWith: {
    handle: string;
    productType: string;
    reason: string;
  }[]
}

/**
 * Get "Complete the Look" recommendations for a product handle
 */
export async function getCompleteLook(handle: string): Promise<any[]> {
  try {
    const client = await clientPromise
    const db = client.db('asuka_couture')
    const styling = await db.collection('styling_graph').findOne({ productId: handle })
    
    if (!styling) {
      // Internal fallback for common pairings
      if (handle.includes('sherwani')) {
        return [
          { handle: 'ivory-tilla-mojari', title: 'Ivory Tilla Mojari', reason: 'Matches the traditional embroidery' },
          { handle: 'silk-stole', title: 'Silk Stole', reason: 'Adds a layer of sophistication' }
        ]
      }
      return []
    }

    return styling.pairsWellWith
  } catch (err) {
    console.error('Failed to get complete look:', err)
    return []
  }
}
