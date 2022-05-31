Many of you probably have designed and developed multiple applications already but are you using best practices in your code?
<br>
Hi, I am a `React Native` developer and I’m going to tell you about the best folder structure for React Native here. This blog summarizes why a properly defined folder structure is very important. You can count it as one of the best practices of writing code.
After working on some projects, I came up with the following folder structure. There is no defined pattern for a folder structure. So, we can create according to our project requirement.

# Structure of folder which is-
<a href="https://miro.medium.com/max/1206/1*KI5WYD_ZmkLOWypuH4xHHg.png">
    <img src="https://miro.medium.com/max/1206/1*KI5WYD_ZmkLOWypuH4xHHg.png" width="500"/>
</a>

As seen in the referenced screenshot above, At the very first I created a base folder “src” which will store all the necessary folders or files in it for the project.

<br><br>

# assets/
This folder will store all the assets that we are using in react-native. You can add static files like fonts and images to it. Also, you can add more assets like videos in this folder according to your project requirements.
If you started folder name with a small letter then it should be the same for all the folder names.

<br><br>

# components/
In the `components` folder, you can create multiple component files that are used to wrap the application components and determine their overall layout. You can also add reusable and UI components.
You can divide components based on categories: `atoms`, `organisms`, `molecules` & `templates`.

<a href="https://miro.medium.com/max/1284/1*B8JBJgqPz2xI1QyFOnuyeQ.png">
    <img src="https://miro.medium.com/max/1284/1*B8JBJgqPz2xI1QyFOnuyeQ.png" width="500"/>
</a>


<br>

- `atoms`- The smallest possible components, such as `buttons`, `titles`, `inputs` or event color pallets, animations, and fonts can be stored in the `atoms` folder.
- `molecules`- They are the composition of one or more components of atoms.
- `organisms`- The combination of molecules that work together or even with atoms that compose more elaborate interfaces.
- `templates`- The collection of organisms that will make a full-page template.
- `page`- The page will look like the referenced screenshot below-

<a href="https://miro.medium.com/max/1284/1*cb4zPGuI5eRekk0dfFY-_w.png">
    <img src="https://miro.medium.com/max/1284/1*cb4zPGuI5eRekk0dfFY-_w.png" width="500"/>
</a>

<br><br>

# containers/
Just as the name implies, you can put all screen-based components inside containers, such as Splash Screen, Home Screen, bottom Tabs, Sidebar, common header, and the container-based files, etc.
The use case for this folder is included and represents a screen being exported.

<br><br>

# screens/
If you have multiple screens like auth screens: login, register and profile screens, product screens it can be saved here.

<br><br>

# i18n/
This holds translation files for different languages in which you’re using your application.

<br><br>

# navigation/
Your project base navigation goes here. You can create a stack navigator in it and export it to your application.

<br><br>

# stores/
We are using Redux and Redux-Sagas in our project and handle business logic using them. If you are using Redux, then there must be `action`, `reducers`, `saga`, and `services` files that can be put here.
In stores, you can create an actions folder and you can store different types of actions in this folder. You can do the same as reducer, saga, and for services.
- /constants.js
This file contains static values used within the feature. An example of what we could store here is ACTION_TYPES data.
- /actions.js
You can store different types of actions in this folder. The action folder contains all the calling action creators for this feature according to your project requirement.
- /reducers.js
Our application’s navigation data now takes a slice of the application state, we would need a reducer to properly update this sliced data based on triggered actions.
- /selectors.js
This might come across as a bit strange to some of us, however, this segment of our architecture is influenced by the reselect package, which enables us to efficiently compute derived data from our application’s state.
- /services.js
The service folder contains logic, related to external API communications.

<br><br>

# utils/
All the utils/helpers files go here that storing reusable methods and logic like validations, progress bar, date pickers, and according to your app requirements.

<br><br>

# hooks/
If you have custom hooks defined in your project you can put it over here that can be shared across your entire project.

<br><br>

# styles/
You can add universal styles here like `flexDirection: row`, `centerAll`, `itemsEnd` and `container-like equally spacing` from all directions and many more. Here we place the explore feature’s components related styles.

# theme/

- fonts- It contains global fonts like font size, font type, and font-weight. Whenever you come across situations where you need to use the same size of fonts and the same font family, you have to create a theme/font.
Here’s what the `/theme/fonts.js`looks like:

<a href="https://miro.medium.com/max/1284/1*3QJi3vziJ1ivF-03UBMmFw.png">
    <img src="https://miro.medium.com/max/1284/1*3QJi3vziJ1ivF-03UBMmFw.png" width="500"/>
</a>

<br>
- colors- All the colors your application using goes here. All the repeating colors, for example, your application has theme colors which are black & red so you can add primary & secondary colors like black & red. Sample code you can see below image.
Here’s what the `/theme/colors.js` looks like:

<a href="https://miro.medium.com/max/1284/1*RmA_l5uQgEnU9bSgCqBtyA.png">
    <img src="https://miro.medium.com/max/1284/1*RmA_l5uQgEnU9bSgCqBtyA.png" width="500"/>
</a>

<br>
- metrices- This will hold your device dimensions so you can export and use them for responsive layouts. It will manage all the fonts, margins, and images according to device size.
Here’s what the `/theme/metrics.js` looks like:

<a href="https://miro.medium.com/max/1284/1*RBmoK2OTAfYei_GyCk469g.png">
    <img src="https://miro.medium.com/max/1284/1*RBmoK2OTAfYei_GyCk469g.png" width="500"/>
</a>

<br><br>







 
# LIBRARIES 

# 📐 react-native-size-matters

A lightweight, zero-dependencies, React-Native utility belt for scaling the size of your apps UI across different sized devices.

<a href="https://github.com/nirsky/react-native-size-matters/raw/master/examples/ipad.gif">
    <img src="https://github.com/nirsky/react-native-size-matters/raw/master/examples/ipad.gif" width="320"/>
</a>

## Installation
```js
npm install --save react-native-size-matters
//or:
yarn add react-native-size-matters
```

## Motivation
When developing with react-native, you need to manually adjust your app to look great on a variety of different screen sizes. That's a tedious job.  
react-native-size-matters provides some simple tooling to make your scaling a whole lot easier.  
The idea is to develop once on a standard ~5" screen mobile device and then simply apply the provided utils.  
📖 &nbsp;You can read more about what led to this library on my blog post, which can be found  at [Medium](https://medium.com/soluto-engineering/size-matters-5aeeb462900a).

<br><br>

# Conclusion
As we can see there are many ways to organize your code from the simplest to the most complex. It all depends on the codebase size and the team that manages it.
This is just one way I found to be productive and better organized your code among the team, I hope it helps you too.
Happy Programming!