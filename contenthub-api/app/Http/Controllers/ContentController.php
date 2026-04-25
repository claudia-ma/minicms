<?php

namespace App\Http\Controllers;

use App\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ContentController extends Controller
{
    public function index()
    {
        return response()->json(Content::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'body' => 'required|string',
            'status' => 'required|in:draft,published',
            'cover_image' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $content = Content::create($validated);

        return response()->json($content, 201);
    }

    public function show(string $id)
    {
        $content = Content::findOrFail($id);

        return response()->json($content);
    }

    public function update(Request $request, string $id)
    {
        $content = Content::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'body' => 'required|string',
            'status' => 'required|in:draft,published',
            'cover_image' => 'nullable|string',
            'published_at' => 'nullable|date',
        ]);

        $baseSlug = Str::slug($validated['title']);
        $slug = $baseSlug;
        $counter = 1;

        while (\App\Models\Content::where('slug', $slug)->exists()) {
        $slug = $baseSlug . '-' . $counter;
        $counter++;
        }

        $validated['slug'] = $slug;
        $content->update($validated);
        return response()->json($content);
    }

    public function destroy(string $id)
    {
        $content = Content::findOrFail($id);
        $content->delete();

        return response()->json(['message' => 'Contenido eliminado correctamente']);
    }
}