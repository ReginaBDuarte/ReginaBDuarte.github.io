**Button** — pill-shaped action button in the brand voice. Use coral `primary` for the single key action, iris `secondary`/`soft` for supporting actions, `outline`/`ghost` for low-emphasis.

```jsx
<Button variant="primary" size="lg">Read the paper</Button>
<Button variant="secondary">View project</Button>
<Button variant="ghost" iconRight={<span>→</span>}>More</Button>
```

Variants: `primary` (coral), `secondary` (iris solid), `soft` (iris tint), `outline`, `ghost`. Sizes: `sm` `md` `lg`. Pass `as="a"` + `href` for links.
