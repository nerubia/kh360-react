import { Badge } from "@components/ui/badge/badge"
import { Button } from "@components/ui/button/button"
import { Icon } from "@components/ui/icon/icon"
import { useMobileView } from "@hooks/use-mobile-view"

const imageList = [
  "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
  "https://www.foxyfolksy.com/wp-content/uploads/2021/04/cajun-seafood-boil-recipe.jpg",
  "https://t3.ftcdn.net/jpg/02/19/70/66/360_F_219706680_lBTVyfxx3ECp2wBfHW1AMBuIiq7Jzixb.jpg",
  "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2017/3/21/0/fnd_pasta-istock.jpg.rend.hgtvcom.1280.720.suffix/1490188710731.jpeg",
  "https://cdn.shopify.com/s/files/1/0588/8527/5820/files/Cajun_seafood_boil.jpg?v=1659014201",
]

const categories = [
  "seafood",
  "street food",
  "korean food",
  "japanese food",
  "Italian cuisine",
  "Mexican cuisine",
  "Vegetarian dishes",
  "Vegan options",
  "BBQ specialties",
  "Healthy salads",
]

function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * imageList.length)
  return imageList[randomIndex]
}
const Questions = [
  {
    id: 1,
    question: "What is your favorite French food?",
    choices: [
      {
        id: "a",
        name: "Croissant",
        description: "A buttery, flaky pastry",
        price: 5,
      },
      {
        id: "b",
        name: "Escargot",
        description: "Edible snails often served as an appetizer",
        price: 10,
        image: getRandomImage(),
      },
      {
        id: "c",
        name: "Baguette",
        description: "A long, thin loaf of French bread",
        price: 7,
      },
      {
        id: "d",
        name: "Coq au Vin",
        description: "A traditional French chicken dish cooked with wine",
        price: 8,
        image: getRandomImage(),
      },
      {
        id: "e",
        name: "Crème Brûlée",
        description: "A creamy custard dessert with a caramelized sugar topping",
        price: 6,
        image: getRandomImage(),
      },
    ],
  },
  {
    id: 2,
    question: "What is your favorite Italian food?",
    choices: [
      {
        id: "a",
        name: "Pizza",
        description:
          "A savory dish consisting of a round, flat base of dough topped with tomato sauce, cheese, and various toppings",
        price: 10,
        image: getRandomImage(),
      },
      {
        id: "b",
        name: "Spaghetti",
        description: "Long, thin pasta noodles typically served with sauce",
        price: 12,
        image: getRandomImage(),
      },
      {
        id: "c",
        name: "Lasagna",
        description: "A layered pasta dish with meat, sauce, and cheese",
        price: 8,
        image: getRandomImage(),
      },
      {
        id: "d",
        name: "Risotto",
        description:
          "A creamy Italian rice dish cooked with broth until it reaches a creamy consistency",
        price: 11,
      },
      {
        id: "e",
        name: "Baguette",
        description: "A long, thin loaf of French bread",
        price: 9,
        image: getRandomImage(),
      },
      {
        id: "f",
        name: "Baguette",
        description: "A ad hjjkahsd hhjajksdjk hsdhdh",
        price: 123,
        image: getRandomImage(),
      },
    ],
  },
  {
    id: 3,
    question: "What is your favorite seafood?",
    choices: [
      {
        id: "a",
        name: "Salmon",
        description: "A type of fish often prized for its flavor and nutritional content",
        price: 15,
      },
      {
        id: "b",
        name: "Shrimp",
        description: "Small, shellfish often served cooked and peeled",
        price: 12,
        image: getRandomImage(),
      },
      {
        id: "c",
        name: "Lobster",
        description: "A large marine crustacean prized for its meat",
        price: 14,
        image: getRandomImage(),
      },
      {
        id: "d",
        name: "Crab",
        description: "A crustacean with a broad, flat body and large pincers",
        price: 18,
        image: getRandomImage(),
      },
      {
        id: "e",
        name: "Sushi",
        description:
          "A Japanese dish consisting of vinegared rice combined with various ingredients, such as seafood and vegetables",
        price: 16,
        image: getRandomImage(),
      },
    ],
  },
  {
    id: 4,
    question: "What is your favorite dessert?",
    choices: [
      {
        id: "a",
        name: "Cake",
        description: "A sweet baked dessert",
        price: 20,
        image: getRandomImage(),
      },
      {
        id: "b",
        name: "Ice Cream",
        description: "A frozen dessert made from dairy products",
        price: 25,
        image: getRandomImage(),
      },
      {
        id: "c",
        name: "Cookies",
        description: "Small, sweet baked treats",
        price: 22,
        image: getRandomImage(),
      },
      {
        id: "d",
        name: "Pie",
        description: "A baked dish with a pastry crust filled with sweet or savory ingredients",
        price: 21,
        image: getRandomImage(),
      },
      {
        id: "e",
        name: "Pudding",
        description: "A creamy dessert typically served chilled",
        price: 24,
        image: getRandomImage(),
      },
    ],
  },
  {
    id: 5,
    question: "What is your favorite type of cuisine?",
    choices: [
      {
        id: "a",
        name: "Mexican",
        description: "Traditional dishes and flavors from Mexico",
        price: 30,
        image: getRandomImage(),
      },
      {
        id: "b",
        name: "Japanese",
        description: "Cuisine from Japan, known for its sushi, ramen, and tempura",
        price: 35,
        image: getRandomImage(),
      },
      {
        id: "c",
        name: "Indian",
        description:
          "Flavorful dishes from India, often featuring spices and herbs asdsadadadas a asdasdsadsad asd asdasd asdasdasd asd asd asd as",
        price: 32,
        image: getRandomImage(),
      },
      {
        id: "d",
        name: "Thai",
        description: "Spicy and aromatic cuisine from Thailand",
        price: 33,
        image: getRandomImage(),
      },
      {
        id: "e",
        name: "Italian",
        description: "Cuisine from Italy, known for pasta, pizza, and risotto",
        price: 34,
        image: getRandomImage(),
      },
    ],
  },
]

export const SurveyFormTable = () => {
  const isMobile = useMobileView()
  // const defaultImage = "https://via.placeholder.com/150"

  return (
    <div>
      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptates, natus odio! Eaque
        necessitatibus molestiae, fugiat nam labore modi sed saepe nemo consequuntur voluptatum
        maxime soluta eum tenetur? Adipisci nostrum deserunt quod cum amet ipsum.
      </div>
      <div className='mt-10'>
        {Questions.map((question) => (
          <div key={question.id} className='mb-10'>
            <p className='mb-1 font-bold flex items-center gap-5'>
              {question.id}
              {"."} {question.question}
              <Badge variant='darkPurple' size='medium'>
                {0}
              </Badge>
            </p>
            <div className='flex flex-row gap-4 overflow-auto whitespace-nowrap'>
              {categories.map((category, index) => (
                <div key={index}>
                  <div className='mb-4'>
                    <Button fullWidth variant={"primaryOutline"} size='small' fullHeight>
                      {category}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex flex-wrap justify-center gap-1 mt-1 h-96 overflow-y-auto overflow-x-hidden bg-gray-50'>
              {question.choices.map((choice) => (
                <label
                  key={choice.id}
                  htmlFor={`question_${question.id}_${choice.id}`}
                  className='flex-shrink-0 relative overflow-hidden rounded-lg max-w-xs shadow-lg cursor-pointer'
                >
                  <div
                    key={choice.id}
                    className={`flex-grow max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 h-full`}
                  >
                    <div className={`${isMobile ? "w-64" : "w-48"} h-full relative 2xl:w-96`}>
                      {choice.image !== null && choice.image !== undefined ? (
                        <img
                          className='rounded-t-lg object-cover w-full h-48'
                          src={choice.image}
                          alt='img'
                        />
                      ) : (
                        <div className='bg-gray-200 h-48 flex justify-center items-center 2xl:w-80'>
                          <Icon icon='DefaultImage' size='large' />
                        </div>
                      )}

                      <div className='p-5 2xl:w-80'>
                        <div className='flex items-center justify-start gap-2'>
                          <input
                            type='checkbox'
                            id={`question_${question.id}_${choice.id}`}
                            name={`question_${question.id}`}
                            value={choice.id}
                            // onChange={() => handleCheckboxChange(question.id, choice.id)}
                          />
                          <h5 className='text-xl font-bold tracking-tight text-gray-900 dark:text-white'>
                            {choice.name.length > 20
                              ? `${choice.name.slice(0, 20)}...`
                              : choice.name}
                          </h5>
                        </div>
                        <p className='mb-1 font-normal text-gray-700 dark:text-gray-400'>
                          {choice.description.length > 50
                            ? `${choice.description.slice(0, 50)}...`
                            : choice.description}
                        </p>
                        <div className='font-bold'>price: {choice.price}</div>
                      </div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between'>
        <Button variant='primaryOutline'>Cancel & Exit</Button>
        <Button variant='primary'>Save & Submit</Button>
      </div>
    </div>
  )
}
