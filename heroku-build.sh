if [ "$BUILD_APP" = "api" ]; 
        then yarn build:api; 
    elif [ "$BUILD_APP" = "indexer" ]; 
        then yarn build:indexer; 
    else echo invalid env detected, please set BUILD_APP; 
fi