"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Category, Color, Cuisine, Image, Kitchen, Product, Size } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ImageUpload from "@/components/image-upload"
import { MultiUploader } from "@/components/mulit-uploader"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  name: z.string().min(1),
  images: z.object({ url: z.string() }).array(),
  price: z.coerce.number().min(1),
  energy: z.coerce.number(),
  carbohydrates: z.coerce.number(),
  sugars: z.coerce.number(),
  dietaryFiber: z.coerce.number(),
  fat: z.coerce.number(),
  protein: z.coerce.number(),
  categoryId: z.string(),
  vitaminA: z.coerce.number(),
  thiamineB1: z.coerce.number(),
  riboflavinB2: z.coerce.number(),
  niacinB3: z.coerce.number(),
  pantothenicAcidB5: z.coerce.number(),
  vitaminB6: z.coerce.number(),
  folateB9: z.coerce.number(),
  vitaminC: z.coerce.number(),
  vitaminE: z.coerce.number(),
  vitaminK: z.coerce.number(),
  calcium: z.coerce.number(),
  iron: z.coerce.number(),
  magnesium: z.coerce.number(),
  manganese: z.coerce.number(),
  phosphorus: z.coerce.number(),
  potassium: z.coerce.number(),
  sodium: z.coerce.number(),
  zinc: z.coerce.number(),
  // colorId: z.string().min(1),
  sizeId: z.string().min(1),
  kitchenId: z.string().min(1),
  cuisineId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>

interface ProductFormProps {
  initialData: Product & {
    images: Image[]
  } | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  kitchens: Kitchen[];
  cuisines: Cuisine[];
};

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  kitchens,
  cuisines,
  colors
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit product' : 'Create product';
  const description = initialData ? 'Edit a product.' : 'Add a new product';
  const toastMessage = initialData ? 'Product updated.' : 'Product created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
    price: parseFloat(String(initialData?.price)),
    energy: parseFloat(String(initialData?.energy)),
    carbohydrates: parseFloat(String(initialData?.carbohydrates)),
    sugars: parseFloat(String(initialData?.sugars)),
    dietaryFiber: parseFloat(String(initialData?.dietaryFiber)),
    fat: parseFloat(String(initialData?.fat)),
    protein: parseFloat(String(initialData?.protein)),
    vitaminA: parseFloat(String(initialData?.vitaminA)),
    thiamineB1: parseFloat(String(initialData?.thiamineB1)),
    riboflavinB2: parseFloat(String(initialData?.riboflavinB2)),
    niacinB3: parseFloat(String(initialData?.niacinB3)),
    pantothenicAcidB5: parseFloat(String(initialData?.pantothenicAcidB5)),
    vitaminB6: parseFloat(String(initialData?.vitaminB6)),
    folateB9: parseFloat(String(initialData?.folateB9)),
    vitaminC: parseFloat(String(initialData?.vitaminC)),
    vitaminE: parseFloat(String(initialData?.vitaminE)),
    vitaminK: parseFloat(String(initialData?.vitaminK)),
    calcium: parseFloat(String(initialData?.calcium)),
    iron: parseFloat(String(initialData?.iron)),
    magnesium: parseFloat(String(initialData?.magnesium)),
    manganese: parseFloat(String(initialData?.manganese)),
    phosphorus: parseFloat(String(initialData?.phosphorus)),
    potassium: parseFloat(String(initialData?.potassium)),
    sodium: parseFloat(String(initialData?.sodium)),
    zinc: parseFloat(String(initialData?.zinc)),
  } : {
    name: '',
    images: [],
    price: 0,
    energy: 0,
    carbohydrates: 0,
    sugars: 0,
    dietaryFiber: 0,
    fat: 0,
    protein: 0,
    vitaminA: 0,
    thiamineB1: 0,
    riboflavinB2: 0,
    niacinB3: 0,
    pantothenicAcidB5: 0,
    vitaminB6: 0,
    folateB9: 0,
    vitaminC: 0,
    vitaminE: 0,
    vitaminK: 0,
    calcium: 0,
    magnesium: 0,
    manganese: 0,
    phosphorus: 0,
    potassium: 0,
    sodium: 0,
    zinc: 0,
    categoryId: '',
    colorId: '',
    sizeId: '',
    isFeatured: false,
    isArchived: false,
  }

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProductFormValues) => {
    const values = {
      ...data,
      price: String(data?.price),
      energy: String(data?.energy),
      carbohydrates: String(data?.carbohydrates),
      sugars: String(data?.sugars),
      dietaryFiber: String(data?.dietaryFiber),
      fat: String(data?.fat),
      protein: String(data?.protein),
      vitaminA: String(data?.vitaminA),
      thiamineB1: String(data?.thiamineB1),
      riboflavinB2: String(data?.riboflavinB2),
      niacinB3: String(data?.niacinB3),
      pantothenicAcidB5: String(data?.pantothenicAcidB5),
      vitaminB6: String(data?.vitaminB6),
      folateB9: String(data?.folateB9),
      vitaminC: String(data?.vitaminC),
      vitaminE: String(data?.vitaminE),
      vitaminK: String(data?.vitaminK),
      calcium: String(data?.calcium),
      iron: String(data?.iron),
      magnesium: String(data?.magnesium),
      manganese: String(data?.manganese),
      phosphorus: String(data?.phosphorus),
      potassium: String(data?.potassium),
      sodium: String(data?.sodium),
      zinc: String(data?.zinc),
    }
      console.log('values: ', values);
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/products`, values);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <>
                    {/* <ImageUpload 
                      value={field.value.map((image) => image.url)} 
                      disabled={loading} 
                      onChange={(url) => field.onChange([...field.value, { url }])}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                    /> */}
                    <MultiUploader 
                      value={field.value.map((image) => image.url)} 
                      disabled={loading} 
                      onChange={(urls) => {
                        field.onChange(urls.map((url) => ({ url })));
                      }}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="sizeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={size.id}>{size.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {colors.map((color) => (
                        <SelectItem key={color.id} value={color.id}>{color.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="kitchenId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kitchen</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a kitchen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {kitchens.map((kitchen) => (
                        <SelectItem key={kitchen.id} value={kitchen.id}>{kitchen.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cuisineId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cuisine</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select a cuisine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cuisines.map((cuisine) => (
                        <SelectItem key={cuisine.id} value={cuisine.id}>{cuisine.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Featured
                    </FormLabel>
                    <FormDescription>
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isArchived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Archived
                    </FormLabel>
                    <FormDescription>
                      This product will not appear anywhere in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
      
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Attribute</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Attribute</SheetTitle>
                  {/* <SheetDescription>
                    Make changes to your profile here. Click save when you're done.
                  </SheetDescription> */}
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="text-right">
                      Energy
                    </Label>
                    <FormField
                      control={form.control}
                      name="energy"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          {/* <FormLabel>Energy</FormLabel> */}
                          <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="text-right">
                      Carbohydrates
                    </Label>
                    <FormField
                      control={form.control}
                      name="carbohydrates"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          {/* <FormLabel>Carbohydrates</FormLabel> */}
                          <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="text-right">
                    Sugars
                    </Label>
                    <FormField
                      control={form.control}
                      name="sugars"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          {/* <FormLabel>Sugars</FormLabel> */}
                          <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="text-right">
                      DietaryFiber
                    </Label>
                    <FormField
                      control={form.control}
                      name="dietaryFiber"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          {/* <FormLabel>DietaryFiber</FormLabel> */}
                          <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="text-right">
                      Fat
                    </Label>
                    <FormField
                      control={form.control}
                      name="fat"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          {/* <FormLabel>Fat</FormLabel> */}
                          <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <Label htmlFor="name" className="text-right">
                      Protein
                    </Label>
                    <FormField
                      control={form.control}
                      name="protein"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          {/* <FormLabel>Protein</FormLabel> */}
                          <FormControl>
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                {/* <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter> */}
              </SheetContent>
            </Sheet>
      
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Vitamins</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Vitamins</SheetTitle>
                  {/* <SheetDescription>
                    Make changes to your profile here. Click save when you're done.
                  </SheetDescription> */}
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="vitaminA"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            VitaminA
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="thiamineB1"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            ThiamineB1
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="riboflavinB2"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            RiboflavinB2
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="niacinB3"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            NiacinB3
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pantothenicAcidB5"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            PantothenicAcidB5
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} className="space-y-2 col-span-2" />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vitaminB6"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            VitaminB6
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="folateB9"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            FolateB9
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vitaminC"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            VitaminC
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vitaminE"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            VitaminE
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vitaminK"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            VitaminK
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </SheetContent>
            </Sheet>
      
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Minerals</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Edit Minerals</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="calcium"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Calcium
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="iron"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Iron
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="magnesium"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Magnesium
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="manganese"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Manganese
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phosphorus"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Phosphorus
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="potassium"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Potassium
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sodium"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Sodium
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zinc"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <div className="flex justify-between items-center">
                          <FormLabel className="flex-1">
                            Zinc
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Input type="number" disabled={loading} placeholder="9.99" {...field} />
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter> */}
              </SheetContent>
            </Sheet>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
