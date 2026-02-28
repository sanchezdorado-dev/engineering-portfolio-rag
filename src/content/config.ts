import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projectsCollection = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
    schema: z.object({
        featured: z.boolean().default(false),
        priority: z.number().int().default(100),
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        thumbnail: z.string().optional(),
        repository: z.union([
            z.string().url("Must be a valid URL"),
            z.array(z.object({ label: z.string(), url: z.string().url("Must be a valid URL") })),
        ]).optional(),
        liveUrl: z.string().url("Must be a valid URL").optional(),
        skills: z.array(z.string()).min(1, "At least one skill is required"),
        status: z.enum(["production", "development"]).optional(),
    }),
});

const technologiesCollection = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/technologies" }),
    schema: z.object({
        order: z.number().int().optional(),
        name: z.string().min(1, "Category name is required"),
        technologies: z.array(
            z.object({
                name: z.string().min(1, "Technology name is required"),
                icon: z.string()
                    .min(1, "Icon is required")
                    .regex(
                        /^[a-z0-9-]+$/,
                        "Icon must be lowercase and without spaces (Simple Icons format)"
                    ),
                color: z.string().optional(),
            })
        ),
    }),
});

const trajectoryCollection = defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/trajectory" }),
    schema: z.object({
        order: z.number().int().optional(),
        type: z.enum(["experience", "education"], {
            errorMap: () => ({ message: 'Type must be "experience" or "education"' }),
        }),
        period: z.string().min(1, "Period is required"),
        institution: z.string().min(1, "Institution or company name is required"),
        role: z.string().min(1, "Role or title is required"),
        description: z.array(z.string().min(1, "Description line cannot be empty")).optional(),
        skills: z.array(z.string().min(1, "Skill name cannot be empty")).optional(),
    }),
});

export const collections = {
    technologies: technologiesCollection,
    trajectory: trajectoryCollection,
    projects: projectsCollection,
};