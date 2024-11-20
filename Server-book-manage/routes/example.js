{
  $lookup: {
    from: "booksolds";
    let: {
      codeOrder: "$codeOrder";
    }
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ["$codeOrder", "$$codeOrder"],
          },
        },
      },
      {
        $lookup: {
          from: "books",
          let: {
            bookId: "$bookId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$bookId"],
                },
              },
            },
            {
              $lookup: {
                from: "imagebooks",
                let: {
                  bookId: "$_id",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          {
                            $eq: ["$bookId", "$$bookId"],
                          },
                          {
                            $eq: ["$isMain", true],
                          },
                        ],
                      },
                    },
                  },
                ],
                as: "image",
              },
            },
            {
              $unwind: {
                path: "$image",
              },
            },
          ],
          as: "book",
        },
      },
      {
        $unwind: {
          path: "$book",
        },
      },
      {
        $project: {
          _id: 0,
          id: "$book._id",
          title: "$book.title",
          price: 1,
          image: "$book.image.image",
        },
      },
    ];
    as: "book";
  }
}
