/// <reference types="@sveltejs/kit" />

interface tree_i{
    label: string
    children?: [tree_i]
    link?: string
}