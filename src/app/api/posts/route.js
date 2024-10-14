import clientPromise from "@/utils/mongo";

export async function POST(req) {
  const body = await req.json();
  const { title, desc, img, slug, catSlug } = body;

  if (!title || !desc || !slug) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const post = {
      title,
      desc,
      img,
      slug,
      catSlug,
      createdAt: new Date(),
    };

    const result = await db.collection("posts").insertOne(post);

    return new Response(JSON.stringify({ id: result.insertedId, slug }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
