import { expect, test } from "vitest";

import { Slug } from "./slug";

test('it should be able to create a slug from a text', () => {

  const slug = Slug.createFromText("An Example Of Slug")

  expect(slug.value).toEqual("an-example-of-slug")
})
